import { Server } from "http";

const socketIO = require("socket.io");
import { Socket } from "socket.io";

import {
  notificationService,
  ordersNotificationService,
} from "../components(apps)/notifications";
import { redisClient } from "./redis.service";
import { ordersService } from "../components(apps)/orders";
import { driverRiderService } from "../components(apps)/driversAndRiders";
import { findClosestDriverOrRider } from "./geospatial.services";
import { makuService } from "../components(apps)/maku";
import { messengerService } from "../components(apps)/messenger";
import { towingService, transportService } from "../components(apps)/transport";
import { makuNotificationService } from "../components(apps)/notifications/services/makuNotifications";
import { walletService } from "../components(apps)/wallet";

class WebSocket {
  private io: Socket;

  constructor(server: Server) {
    this.io = socketIO(server);
  }

  public connectSocket() {
    this.io.on("connection", (socket: Socket) => {
      console.log("User connected");
      const clientId = socket.id;
      this.listenForEvents(socket, clientId);

      socket.on("disconnect", async () => {
        console.log("User disconnected");
        const driverId = await redisClient.get(`socketId:${clientId}`);
        driverRiderService.setAvailablity(driverId, false);
        redisClient.delete(`socketId:${clientId}`);
      });
    });
  }

  private listenForEvents(socket: Socket, clientId: string) {
    socket.on("driver-start-working", (message) => {
      try {
        driverRiderService.setAvailablity(message.id, true);
        redisClient.set(`socketId:${clientId}`, message.id);
      } catch (error: any) {
        socket.emit("driver-start-working-error", error.message);
      }
    });

    socket.on("driver-stop-working", (message) => {
      try {
        driverRiderService.setAvailablity(message.id, false);
        redisClient.delete(`socketId:${clientId}`);
      } catch (error: any) {
        socket.emit("driver-stop-working-error", error.message);
      }
    });

    socket.on("fcm-vendor-device-token", async (message) => {
      const { vendor: vendorId, deviceToken } = message;
      console.log({ vendorId, deviceToken });
      await redisClient.set(`device-token:${vendorId}`, deviceToken);
    });

    socket.on("fcm-customer-device-token", async (message) => {
      const { customer: customerId, deviceToken } = message;
      console.log({ customerId, deviceToken });
      await redisClient.set(`device-token:${customerId}`, deviceToken);
    });

    socket.on("fcm-rider-device-token", async (message) => {
      const { riderId, deviceToken } = message;
      console.log({ riderId, deviceToken });
      await redisClient.set(`device-token:${riderId}`, deviceToken);
    });

    socket.on("fcm-driver-device-token", async (message) => {
      const { driverId, deviceToken } = message;
      await redisClient.set(`device-token:${driverId}`, deviceToken);
    });

    socket.on("update-driver-rider-location", async (message) => {
      const { driverId, coordinates } = message;
      // console.log({ driverId, coordinates });
      try {
        await driverRiderService.updateLocation(driverId, coordinates);
      } catch (error) {
        console.log({ error });
        socket.emit("update-driver-rider-location-error", error, message);
      }
    });

    socket.on("create-order", async (message) => {
      console.log({ message });
      try {
        const order = await ordersService.createOrder(message);
        console.log({ order });
        message = {
          _id: order,
          ...message,
        };
        console.log({ message });
        await notificationService.vendorHandleOrderRequest(socket, message);
        socket.emit("created-order", order);
      } catch (error) {
        console.error({ error });
      }
    });

    socket.on("order-accepted", async (message) => {
      console.log({ acceptedOrderId: message.orderId });
      try {
        const order = await ordersService.setStatusToProcessing(
          message.orderId
        );
        if (order) {
          const orderData = ordersService.prepareOrderDataForRider(order);

          const shopCoordinates = order?.items.reduce((acc: any, item: any) => {
            acc = item.shop.location.coordinates;
            return acc;
          }, {});

          const riders = await findClosestDriverOrRider(
            shopCoordinates,
            "rider",
            10.5
          );
          console.log({ riders });

          riders.forEach((rider) => {
            notificationService.notifyRiderOfOrder(rider._id, orderData);
          });
        }
      } catch (error: any) {
        console.error(error);
      }
    });

    socket.on("order-rejected", async (message) => {
      try {
        ordersService.setStatusToRejected(message.orderId);
      } catch (error: any) {
        socket.emit("order-rejected-error", error.message);
      }
    });

    socket.on("assign-rider", async (message) => {
      const { orderId, riderId } = message;
      try {
        const order = await ordersService.assignRider(orderId, riderId);
        console.log({ order });
        await ordersNotificationService.notifyCustomerOfOrderStatus(
          order,
          "Order Assigned",
          "A rider has accepted and is assigned to your order"
        );
      } catch (error: any) {
        socket.emit("assign-rider-error", error.message);
      }
    });

    socket.on("order-in-transit", async (message) => {
      const { orderId } = message;
      console.log({ orderId });
      await ordersService.setStatusToTransit(orderId);
      try {
      } catch (error: any) {
        socket.emit("order-in-transit-error", error.message);
      }
    });

    socket.on("order-arrived", async (message) => {
      const { orderId } = message;
      await ordersService.setStatusToArrived(orderId);
      try {
      } catch (error: any) {
        socket.emit("order-arrived-error", error.message);
      }
    });

    socket.on("order-delivered", async (message) => {
      const { orderId } = message;
      await ordersService.setStatusToDelivered(orderId);
      try {
      } catch (error: any) {
        socket.emit("order-delivered-error", error.message);
      }
    });

    socket.on("find-nearest-drivers", async (message) => {
      const {
        pickUpCoordinates,
        pickUpAddress,
        destinationAddress,
        destinationCoordinates,
        customer,
        searchKMLimit,
        vehicleType,
      } = message;

      try {
        const drivers = await makuService.findNearestDrivers(
          pickUpCoordinates,
          pickUpAddress,
          destinationCoordinates,
          destinationAddress,
          customer,
          searchKMLimit,
          vehicleType
        );
        console.log({ nearestDrivers: drivers });
        socket.emit("found-nearest-drivers", drivers);
        socket.join(`maku:${customer}`);
      } catch (error: any) {
        socket.emit("found-nearest-drivers-error", error.message);
      }
    });

    socket.on("create-trip", async (message) => {
      try {
        const trip = await makuService.createTrip(message);
        const getTrip = await makuService.getTripDetails(trip._id);
        const room = `maku:${trip.customer}`;
        socket.join(room);
        this.io.to(room).emit("created-trip", getTrip);
      } catch (error: any) {
        socket.emit("create-trip-error", error.message);
        console.log("error creating trip", error.message);
      }
    });

    socket.on("arrived-pickup-location", async (message) => {
      try {
        const trip: any = await makuService.driverArrivedLocation(
          message.tripId
        );
        await notificationService.notifyCustomerOnDrivalArrival(trip.customer, {
          _id: trip._id,
          status: trip.status,
        });
      } catch (error: any) {
        socket.emit("arrived-pickup-location-error", error.message);
      }
    });

    socket.on("start-trip", async (message) => {
      try {
        const trip = await makuService.startTrip(message.tripId);
        await makuNotificationService.notifyCustomerOfTripStatus(
          trip,
          "Trip started",
          "We hope you enjoy your ride"
        );
      } catch (error: any) {
        socket.emit("start-trip-error", error.message);
        console.log("error starting trip", error.message);
      }
    });

    socket.on("complete-trip", async (message) => {
      try {
        const trip = await makuService.completeTrip(message.tripId);
        console.log({ trip });
        await makuNotificationService.notifyCustomerOfTripStatus(
          trip,
          "Trip completed!",
          "We hope you did enjoy your ride"
        );
      } catch (error: any) {
        socket.emit("complete-trip-error", error.message);
        console.log("error completing trip", error.message);
      }
    });

    socket.on("cancel-trip", async (message) => {
      try {
        const trip: any = await makuService.cancelTrip(message.tripId);
        if (message.driverId) {
          await notificationService.notifyOnCancelledTrip(
            trip?.customer,
            "driver",
            {
              _id: trip._id,
              status: trip.status,
            }
          );
        } else if (message.customerId) {
          notificationService.notifyOnCancelledTrip(trip?.driver, "passenger", {
            _id: trip._id,
            status: trip.status,
          });
        }
      } catch (error: any) {
        socket.emit("cancel-trip-error", error.message);
        console.log("error starting trip", error.message);
      }
    });

    socket.on("create-messenger-service-order", async (message: any) => {
      const { order, searchKMLimit } = message;
      try {
        const messengerOrder = await messengerService.createOrder(
          order,
          searchKMLimit
        );
        socket.emit("created-messenger-service-order", messengerOrder);
      } catch (error: any) {
        socket.emit("create-messenger-service-order-error", error.message);
      }
    });

    socket.on("assign-rider-to-messenger-order", async function (message: any) {
      const { orderId, riderId } = message;
      try {
        await messengerService.assignRider(orderId, riderId);
      } catch (error: any) {
        socket.emit("assign-rider-to-messenger-order-error", error.message);
      }
    });

    socket.on("messenger-order-picked-up", async (message) => {
      try {
        const { orderId } = message;
        await messengerService.setStatusToPickedUp(orderId);
      } catch (error: any) {
        socket.emit("messenger-order-picked-up-error", error.message);
      }
    });

    socket.on("messenger-order-arrived", async (message) => {
      const { orderId } = message;
      try {
        await messengerService.setStatusToArrived(orderId);
      } catch (error: any) {
        socket.emit("messenger-order-arrived-error", error.message);
      }
    });

    socket.on("messenger-order-delivered", async (message) => {
      const { orderId } = message;
      try {
        await messengerService.setStatusToDelivered(orderId);
      } catch (error: any) {
        socket.emit("messenger-order-delivered-error", error.message);
      }
    });

    socket.on("find-tow-companies", async (message: any) => {
      const { pickUpCoordinates } = message;
      try {
        const towCompanies = await towingService.findTowingCompanies();
        console.log({ towCompanies: JSON.stringify(towCompanies) });
        socket.emit("found-tow-companies", towCompanies);
      } catch (error: any) {
        socket.emit("find-tow-companies-error");
      }
    });

    socket.on("find-transport-companies", async (message: any) => {
      const { pickUpCoordinates, serviceTypeId } = message;
      try {
        const transportCompanies =
          await transportService.findTransportCompanies(serviceTypeId);
        socket.emit("found-transport-companies", transportCompanies);
      } catch (error: any) {
        socket.emit("find-transport-companies-error");
      }
    });

    socket.on("get-wallet-balance", async (message: any) => {
      try {
        const walletBalance = await walletService.getWalletBalanceByOwnerId(
          message.ownerId
        );
        socket.emit("wallet-balance", walletBalance);
      } catch (error: any) {
        socket.emit("get-wallet-balance-error", error.message);
      }
    });
  }
}

export { WebSocket };

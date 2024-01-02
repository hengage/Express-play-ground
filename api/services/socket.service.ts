import { Server } from "http";

const socketIO = require("socket.io");
import { Socket } from "socket.io";
import { notificationService } from "../components(apps)/notifications";
import { redisClient } from "./redis.service";
import { ordersService } from "../components(apps)/orders";
import { driverRiderService } from "../components(apps)/driversAndRiders";
import { findClosestDriverOrRider } from "./geospatial.services";
import { makuService } from "../components(apps)/maku";
import { messengerService } from "../components(apps)/messenger";
import { transportService } from "../components(apps)/transport";

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

    socket.on("send-order-notification", async (message) => {
      await notificationService.handleOrderRequest(socket, message);
    });

    socket.on("fcm-vendor-device-token", async (message) => {
      const { vendor: vendorId, deviceToken } = message;
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
      console.log({ driverId, coordinates });
      try {
        await driverRiderService.updateLocation(driverId, coordinates);
      } catch (error) {
        console.log({ error });
        socket.emit("update-driver-rider-location-error", error, message);
      }
    });

    socket.on("save-order", async (message) => {
      try {
        const orderId = await ordersService.createOrder(message);
        const order = await ordersService.getOrder(orderId);
        await ordersService.setStatusToProcessing(orderId);
        await notificationService.sendSavedOrder(order);

        const orderData = ordersService.prepareOrderDataForRider(order);

        const shopCoordinates = order.items.reduce((acc: any, item: any) => {
          acc = item.shop.location.coordinates;
          return acc;
        }, {});

        console.log({orderData})
        const riders = await findClosestDriverOrRider(
          shopCoordinates,
          "rider",
          10.5
        );
        console.log({ riders });

        riders.forEach((rider) => {
          notificationService.notifyRiderOfOrder(rider._id, orderData);
        });
      } catch (error) {
        console.error({ error });
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
        ordersService.assignRider(orderId, riderId);
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
        const room = `maku:${trip.customer}`;
        socket.join(room);
        this.io.to(room).emit("created-trip", trip);
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
        console.log(trip.customer);
        await notificationService.notifyCustomerOnDrivalArrival(
          trip.customer,
          trip._id
        );
      } catch (error: any) {
        socket.emit("arrived-pickup-location-error", error.message);
      }
    });

    socket.on("start-trip", async (message) => {
      try {
        await makuService.startTrip(message.tripId);
      } catch (error: any) {
        socket.emit("start-trip-error", error.message);
        console.log("error starting trip", error.message);
      }
    });

    socket.on("complete-trip", async (message) => {
      try {
        await makuService.completeTrip(message.tripId);
      } catch (error: any) {
        socket.emit("complete-trip-error", error.message);
        console.log("error starting trip", error.message);
      }
    });

    socket.on("cancel-trip", async (message) => {
      try {
        const trip: any = await makuService.cancelTrip(message.tripId);
        if (message.driverId) {
          notificationService.notifyOnCancelledTrip(
            trip?.customer,
            "driver",
            trip._id
          );
        } else if (message.customerId) {
          notificationService.notifyOnCancelledTrip(
            trip?.driver,
            "passenger",
            trip._id
          );
        }
      } catch (error: any) {
        socket.emit("cancel-trip-error", error.message);
        console.log("error starting trip", error.message);
      }
    });

    socket.on("create-messenger-service-order", async (message: any) => {
      const { order, searchKMLimit } = message;
      messengerService.createOrder(order, searchKMLimit);
    });

    socket.on("find-tow-companies", async (message: any) => {
      try {
        const towCompanies = await transportService.findTowingCompanies();
        console.log({ towCompanies: JSON.stringify(towCompanies) });
        socket.emit("found-tow-companies", towCompanies);
      } catch (error: any) {
        socket.emit("find-tow-companies-error");
      }
    });
  }
}

export { WebSocket };

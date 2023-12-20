import { Server } from "http";

const socketIO = require("socket.io");
import { Socket } from "socket.io";
import { notificationService } from "../components(apps)/notifications";
import { redisClient } from "./redis.service";
import { ordersService } from "../components(apps)/orders";
import {
  driverRiderService,
} from "../components(apps)/driversAndRiders";
import { findClosestDriverOrRider } from "./geospatial.services";
import { makuService } from "../components(apps)/maku";

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
      driverRiderService.setAvailablity(message.driverId, true);
      redisClient.set(`socketId:${clientId}`, message.driverId);
    });

    socket.on("driver-stop-working", (message) => {
      driverRiderService.setAvailablity(message.driverId, false);
      redisClient.delete(`socketId:${clientId}`);
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
        socket.emit("update-driver-rider-location-error", error,message)
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

    socket.on("assign-rider", async (message) => {
      const { orderId, riderId } = message;
      try {
        ordersService.assignRider(orderId, riderId)
      } catch (error: any) {
        socket.emit("assign-rider-error", error.message);
      }
    });

    socket.on("find-nearest-drivers", async (message) => {
      try {
        const drivers = await makuService.findNearestDrivers(
          message.pickupLocation
        );
        console.log({ nearestDrivers: drivers });
        socket.emit("found-nearest-drivers", drivers);
      } catch (error: any) {
        socket.emit("found-nearest-drivers-error", error.message);
      }
    });

    socket.on("create-trip", async (message) => {
      try {
        const trip = await makuService.createTrip(message)
        socket.emit('created-trip', trip)
      } catch (error: any) {
        socket.emit("create-trip-error", error.message)
        console.log("error creating trip", error.message)
      }
    })

    socket.on("start-trip", async(message) => {
      try {
        await makuService.startTrip(message.tripId)
      } catch (error: any) {
        socket.emit("start-trip-error", error.message)
        console.log("error starting trip", error.message)
      }
    })

    socket.on("complete-trip", async(message) => {
      try {
        await makuService.completeTrip(message.tripId)
      } catch (error: any) {
        socket.emit("complete-trip-error", error.message)
        console.log("error starting trip", error.message)
      }
    })

    socket.on("cancel-trip", async(message) => {
      try {
        await makuService.cancelTrip(message.tripId)
      } catch (error: any) {
        socket.emit("cancel-trip-error", error.message)
        console.log("error starting trip", error.message)
      }
    })
  }
}

export { WebSocket };

import { Server } from "http";

const socketIO = require("socket.io");
import { Socket } from "socket.io";
import { notificationService } from "../components(apps)/notifications";
import { redisClient } from "./redis.service";
import { ordersService } from "../components(apps)/orders";
import {
  DriverRider,
  driverRiderService,
} from "../components(apps)/driversAndRiders";
import { HandleException } from "../utils";
import { STATUS_CODES } from "../constants";
import { findClosestDriverOrRider } from "./geospatial.services";

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
      const { driverRiderId, deviceToken } = message;
      await redisClient.set(`device-token:${driverRiderId}`, deviceToken);
    });

    socket.on("update-driver-rider-location", async (message) => {
      const { driverId, coordinates } = message;
      console.log({ driverId, coordinates });
      try {
       driverRiderService.updateLocation(driverId, coordinates);
      } catch (error) {
        console.log({ error });
      }
    });

    socket.on("save-order", async (message) => {
      try {
        const orderId = await ordersService.createOrder(message);
        const order = await ordersService.getOrder(orderId);
        await ordersService.setStatusToProcessing(orderId);
        await notificationService.sendSavedOrder(order);

        const orderData = ordersService.prepareOrderDataForRider(order)

        const shopCoordinates = order.items.reduce((acc: any, item: any) => {
          acc = item.shop.location.coordinates
          return acc
        }, {})

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
        const order = await ordersService.getOrderById(orderId, "rider");
        order.rider = riderId;
        await order.save();
        console.log({ "assigned rider": order });
      } catch (error: any) {
        socket.emit("assign-rider-error", error.message);
      }
    });
  }
}

export { WebSocket };

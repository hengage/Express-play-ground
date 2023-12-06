import { Server } from "http";

const socketIO = require("socket.io");
import { Socket } from "socket.io";
import { notificationService } from "./notification.service";
import { redisClient } from "./redis.service";
import { ordersService } from "../components(apps)/orders";
import { DriverRider } from "../components(apps)/driversAndRiders";
import { HandleException } from "../utils";
import { STATUS_CODES } from "../constants";

class WebSocket {
  private io: Socket;

  constructor(server: Server) {
    this.io = socketIO(server);
  }

  public connectSocket() {
    this.io.on("connection", (socket: Socket) => {
      console.log("User connected");

      this.listenForEvents(socket);

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }

  private listenForEvents(socket: Socket) {
    socket.on("send-order-notification", async (message) => {
      await notificationService.handleOrderRequest(socket, message);
    });

    socket.on("fcm-vendor-device-token", async (message) => {
      const { vendor: vendorId, deviceToken } = message;
      await redisClient.set(`device-token$${vendorId}`, deviceToken);
    });

    socket.on("fcm-customer-device-token", async (message) => {
      const { customer: customerId, deviceToken } = message;
      console.log({ customerId, deviceToken });
      await redisClient.set(`device-token$${customerId}`, deviceToken);
    });

    socket.on("fcm-rider-driver-device-token", async (message) => {
      const { driverRider: driverRiderId, deviceToken } = message;
      await redisClient.set(`device-token$${driverRiderId}`, deviceToken);
    });

    socket.on("save-order", async (message) => {
      try {
        const orderId = await ordersService.createOrder(message);
        const order = await ordersService.getOrder(orderId);
        notificationService.sendSavedOrder(order);
      } catch (error) {
        console.error({ error });
      }
    });

    socket.on("update-driver-rider-location", async (message) => {
      try {
        const driver = await DriverRider.findById(message._id);

        if (!driver) {
          throw new HandleException(
            STATUS_CODES.NOT_FOUND,
            "Cannot find driver"
          );
        }
        driver.location.coordinates = message.coordinates;
        await driver.save();
      } catch (error) {
        console.log({ error });
      }
    });
  }
}

export { WebSocket };

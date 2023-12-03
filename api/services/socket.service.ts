import { Server } from "http";

const socketIO = require("socket.io");
import { Socket } from "socket.io";
import { notificationService } from "./notification.service";
import { redisClient } from "./redis.service";
import { ordersService } from "../components(apps)/orders";

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
      await this.handleOrderNotification(socket, message);
    });

    socket.on("fcm-vendor-device-token", async (message) => {
      const { vendor: vendorId, deviceToken } = message;
      await redisClient.set(vendorId, deviceToken);
    });

    socket.on("fcm-customer-device-token", async (message) => {
      const { customer: customerId, deviceToken } = message;
      await redisClient.set(customerId, deviceToken);
    });

    socket.on("fcm-rider-driver-device-token", async (message) => {
      const { driverRider: driverRiderId, deviceToken } = message;
      await redisClient.set(driverRiderId, deviceToken);
    });

    socket.on("save-order", async (message) => {
      console.log({ message });
      try {
        ordersService.createOrder(message);
      } catch (error) {
        console.error({error});
      }
    });
  }

  private async handleOrderNotification(socket: Socket, message: any) {
    const { vendor: vendorId } = message;
    const vendorDeviceToken = await redisClient.get(vendorId);
    console.log({ vendorDeviceToken });

    const payload = {
      notification: {
        title: "You have an order to attend to",
        body: "Accept or reject the incoming order",
      },
      data: {
        order: JSON.stringify(message),
      },
      token: `${vendorDeviceToken}`,
    };
    console.log({ message: JSON.stringify(message) });

    await notificationService.sendNotification(payload);

    socket.emit("order-notification-sent", message);
  }
}

export { WebSocket };

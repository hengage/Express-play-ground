import { Server } from "http";

const socketIO = require("socket.io");
import { Socket } from "socket.io";
import { notificationService } from "./notification.service";
import { redisClient } from "./redis.service";

class InitializeWebSocket {
  public async connectSocket(server: Server) {
    const io = socketIO(server);

    io.on("connection", (socket: Socket) => {
      console.log("User connected");

      socket.on("send-order-notification", async (message) => {
        const { vendor: vendorId } = message
        const vendorDeviceToken = await redisClient.get(vendorId)
        console.log({vendorDeviceToken})
        const payload = {
          notification: {
            title: "New message",
            body: "You have a new message from John",
          },
          token: `${vendorDeviceToken}`,
        };

        notificationService.sendNotification(payload);
      });

      socket.on("fcm-vendor-device-token", async (message) => {
        const { vendor: vendorId, deviceToken }  = message;
        await redisClient.set(vendorId, deviceToken);
      });

      socket.on("fcm-customer-device-token", async (message) => {
        const { vendorId, deviceToken }  = message;
        redisClient.set(vendorId, deviceToken);
      });
      socket.on("fcm-rider-driver-device-token", async (message) => {
        const { vendorId, deviceToken }  = message;
        redisClient.set(vendorId, deviceToken);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
}

export const initializeWebSocket = new InitializeWebSocket();
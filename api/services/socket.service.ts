import { Server } from "http";

const socketIO = require("socket.io");
import { Socket } from "socket.io";
import { notificationService } from "./notification.service";

class InitializeWebSocket {
  public async connectSocket(server: Server) {
    const io = socketIO(server);

    let vendor: string;
    io.on("connection", (socket: Socket) => {
      console.log("User connected");

      socket.on("message", (message) => {
        console.log("Message received", message);
      });

      socket.on("create-vendor-room", async (message) => {
        vendor = message.vendorId;
        console.log("Message received", message.vendorId);
        socket.join(message.vendorId);
      });

      socket.on("send-order", async (message) => {
        const payload = {
          notification: {
            title: "New message",
            body: "You have a new message from John",
          },
          token: "device_token",
        };

        notificationService.sendNotification(payload);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
        socket.leave(vendor);
      });
    });
  }
}

export const initializeWebSocket = new InitializeWebSocket();

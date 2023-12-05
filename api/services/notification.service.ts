import { firebaseAdmin } from "../config";
import * as admin from "firebase-admin";
import { Socket } from "socket.io";
import { redisClient } from "./redis.service";

class NotificationService {
  private messaging: admin.messaging.Messaging;

  constructor() {
    this.messaging = firebaseAdmin.messaging();
  }
  public async sendNotification(payload: admin.messaging.Message) {
    try {
      const message = await this.messaging.send(payload);
      console.log("Notification sent", message);
    } catch (error: any) {
      console.error("Error sending notification:", error);
    }
  }

  public async handleOrderRequest(socket: Socket, message: any) {
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
    // console.log({ message: JSON.stringify(message) });

    await this.sendNotification(payload);

    socket.emit("order-notification-sent", message);
  }

  public async sendSavedOrder(order: any) {
    const customerDeviceToken = await redisClient.get(order.customer);
    console.log({ customerDeviceToken });
    const payload = {
      notification: {
        title: "Your order has been accepted",
        // body: "Please view your order",
      },
      data: {
        order: JSON.stringify(order),
      },
      token: `${customerDeviceToken}`,
    };

    await this.sendNotification(payload);
  }
}

export const notificationService = new NotificationService();

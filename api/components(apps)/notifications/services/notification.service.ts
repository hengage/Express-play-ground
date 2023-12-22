import * as admin from "firebase-admin";
import { Socket } from "socket.io";
import { redisClient } from "../../../services";
import { firebaseAdmin } from "../../../config";
import { saveNotification } from "../repositery/notification.repo";

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
    console.log({ vendorId });
    const vendorDeviceToken = await redisClient.get(`device-token:${vendorId}`);
    console.log({ vendorDeviceToken });

    const payload = {
      notification: {
        title: "You have an order to attend to",
        body: "Accept or reject the incoming order",
      },
      data: {
        type: "attend-to-order",
        data: JSON.stringify(message),
      },
      token: `${vendorDeviceToken}`,
    };
    // console.log({ message: JSON.stringify(message) });

    await this.sendNotification(payload);
    socket.emit("order-notification-sent", message);
    await saveNotification(
      vendorId,
      payload.notification.title,
      payload.notification.body,
      payload.data
    );
  }

  public async sendSavedOrder(order: any) {
    console.log({ id: order.customer._id });
    const customerDeviceToken = await redisClient.get(
      `device-token:${order.customer._id}`
    );
    console.log({ customerDeviceToken });
    const payload = {
      notification: {
        title: "Your order has been accepted",
        body: "View details of your order",
      },
      data: {
        type: "order-accepted-by-vendor",
        data: JSON.stringify(order),
      },
      token: `${customerDeviceToken}`,
    };

    await this.sendNotification(payload);
    await saveNotification(
      order.customer,
      payload.notification.title,
      payload.notification.body,
      payload.data
    );
  }

  public async notifyRiderOfOrder(riderId: string, order: any) {
    const riderDeviceToken = await redisClient.get(`device-token:${riderId}`);
    console.log({ riderDeviceToken });
    const payload = {
      notification: {
        title: "You have an order to attend to",
        body: "You can choose to accept or ignore this order",
      },
      data: {
        type: "accept-order-delivery",
        data: JSON.stringify(order),
      },
      token: `${riderDeviceToken}`,
    };
    await this.sendNotification(payload);
  }

  async noitifyDriversOfMakuRequest(driverId: string, tripDetails: any) {
    const driverDeviceToken = await redisClient.get(`device-token:${driverId}`);
    const payload = {
      notification: {
        title: "There is a request for a trip",
        body: "View details and accept the trip",
      },
      data: {
        type: "acceopt-maku-trip-request",
        data: JSON.stringify(tripDetails),
      },
      token: `${driverDeviceToken}`,
    };
    await this.sendNotification(payload);
  }
}

export const notificationService = new NotificationService();

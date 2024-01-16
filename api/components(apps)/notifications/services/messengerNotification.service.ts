import { redisClient } from "../../../services";
import { notificationService } from "./notification.service";

class MessengerNotificationService {
  async notifyCustomerOfOrderStatus(order: any, title: string, body: string) {
    const customerDeviceToken = await redisClient.get(
      `device-token:${order.customer}`
    );
    console.log({ customerDeviceToken });
    const payload = {
      notification: {
        title,
        body,
      },
      data: {
        type: "messenger-order-status",
        data: JSON.stringify({ _id: order._id, status: order.status }),
      },
      token: `${customerDeviceToken}`,
    };
    await notificationService.sendNotification(order.customer, payload);
  }
}

export const messengerNotificationService = new MessengerNotificationService();

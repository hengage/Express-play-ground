import { redisClient } from "../../../services";
import { notificationService } from "./notification.service";

class TransportNotificationService {
    async notifyCompanyOfOrderRequest(tripOrder: any, transportCompanyId: string) {
        const transportCompanyDeviceToken = await redisClient.get(
          `device-token:${transportCompanyId}`
        );
        console.log({ transportCompanyDeviceToken });
        
        const payload = {
          notification: {
            title: "Trip request",
            body: "You have a trip order to accept",
          },
          data: {
            type: "transport-trip-request",
            data: JSON.stringify(tripOrder),
          },
          token: `${transportCompanyDeviceToken}`,
        };
        await notificationService.sendNotification(transportCompanyId, payload);
      }

      
  async notifyCustomerofOrderStatus(transportOrder: any, title: string, body: string ) {
    const customerDeviceToken = await redisClient.get(
      `device-token:${transportOrder.customer}`
    );
    console.log({ customerDeviceToken });
    const payload = {
      notification: {
        title,
        body,
      },
      data: {
        type: "towing-trip",
        data: JSON.stringify({ _id: transportOrder._id, status: transportOrder.status }),
      },
      token: `${customerDeviceToken}`,
    };
    await notificationService.sendNotification(transportOrder.customer, payload);
  }
}

export const transportNotificationService = new TransportNotificationService()
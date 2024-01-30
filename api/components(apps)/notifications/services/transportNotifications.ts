import { redisClient } from "../../../services";
import { notificationService } from "./notification.service";

class TransportNotificationService {
    async notifyCompanyOfOrderRequest(trip: any, title: string, body: string) {
        const transportCompanyDeviceToken = await redisClient.get(
          `device-token:${trip.customer}`
        );
        console.log({ transportCompanyDeviceToken });
        const payload = {
          notification: {
            title,
            body,
          },
          data: {
            type: "transport-trip",
            data: JSON.stringify({ _id: trip._id, status: trip.status }),
          },
          token: `${transportCompanyDeviceToken}`,
        };
        await notificationService.sendNotification(trip.customer, payload);
      }
}

export const transportNotificationService = new TransportNotificationService()
import { redisClient } from "../../../services";
import { notificationService } from "./notification.service";

class TowingNotificationService {
    async notifyCompanyOfOrderRequest(trip: any, title: string, body: string) {
        const towingCompanyDeviceToken = await redisClient.get(
          `device-token:${trip.customer}`
        );
        console.log({ towingCompanyDeviceToken });
        const payload = {
          notification: {
            title,
            body,
          },
          data: {
            type: "transport-trip",
            data: JSON.stringify({ _id: trip._id, status: trip.status }),
          },
          token: `${towingCompanyDeviceToken}`,
        };
        await notificationService.sendNotification(trip.customer, payload);
      }
}

export const towingNotificationService = new TowingNotificationService()
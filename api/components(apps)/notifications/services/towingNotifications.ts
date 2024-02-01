import { redisClient } from "../../../services";
import { notificationService } from "./notification.service";

class TowingNotificationService {
    async notifyCompanyOfOrderRequest(tripOrder: any, towingCompanyId: string) {
        const towingCompanyDeviceToken = await redisClient.get(
          `device-token:${towingCompanyId}`
        );
        console.log({ towingCompanyDeviceToken });
        const payload = {
          notification: {
            title: "Trip request",
            body: "You have a trip order to accept"
          },
          data: {
            type: "towing-trip-request",
            data: JSON.stringify(tripOrder),
          },
          token: `${towingCompanyDeviceToken}`,
        };
        await notificationService.sendNotification(towingCompanyId, payload);
      }
}

export const towingNotificationService = new TowingNotificationService()

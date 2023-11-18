import { firebaseAdmin } from "../config";
import * as admin from "firebase-admin";

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
}

export const notificationService = new NotificationService();

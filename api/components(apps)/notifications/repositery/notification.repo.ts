import { Notifications } from "../models/notifications.models";

async function saveNotification(
  userId: string,
  title: string,
  body?: string,
  data?: any
) {
  try {
    const notification = new Notifications({
      user: userId,
      title,
      body,
      data,
    });
    const savedNotification = await notification.save();
    console.log({ savedNotification });
  } catch (error) {
    console.log({ NotificationError: error });
  }
}

export { saveNotification };

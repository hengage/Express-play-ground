import { HandleException } from "../../../utils";
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
  } catch (error) {
    console.log({ NotificationError: error });
  }
}

async function getUserNotifications(userId: string) {
  try {
    const notification = await Notifications.find({ user: userId })
      .select("-__v")
      .lean()
      .exec();
    return notification
  } catch (error: any) {
    throw new HandleException(error.status, error.message)
  }
}

export { saveNotification, getUserNotifications };

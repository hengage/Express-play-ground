import { Request, Response } from "express";
import { getUserNotifications } from "../repositery/notification.repo";
import { STATUS_CODES } from "../../../constants";

class NotificationController {
  public async getUserNotifications(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const userId = (req as any).user._id;
    try {
      const notifications = await getUserNotifications(userId, page);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched user notifications",
        data: notifications,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error fetching user notifications",
        error: error.message,
      });
    }
  }
}

export const notificationsController = new NotificationController();

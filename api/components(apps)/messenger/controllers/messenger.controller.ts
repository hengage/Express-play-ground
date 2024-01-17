import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { messengerRepo } from "../repository/messenger.repo";

class MessengerConteoller {
  async getOrderDetails(req: Request, res: Response) {
    try {
      const messengerOrder = await messengerRepo.getOrder(req.params.orderId);
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: messengerOrder,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed",
        error: error.message || "Server error",
      });
    }
  }
}

export const messengerController = new MessengerConteoller();

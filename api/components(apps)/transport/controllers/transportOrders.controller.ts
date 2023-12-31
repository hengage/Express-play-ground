import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { transportRepo } from "../repository/transport.repo";

class TransportOrdersController {
  async createTowOrder(req: Request, res: Response) {
    try {
      const towOrder = await transportRepo.createTowOrder(req.body);
      res.status(STATUS_CODES.CREATED).json({
        message: "Created tow order",
        data: { towOrder },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to create tow order",
        error: error.message || "Server error",
      });
    }
  }

  async createTransportOrder(req: Request, res: Response) {
    try {
      const tripOrder = await transportRepo.createTransportOrder(req.body);
      res.status(STATUS_CODES.CREATED).json({
        message: "Created trip order",
        data: { tripOrder },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to create trip order",
        error: error.message || "Server error",
      });
    }
  }
}

export const transportOrdersController = new TransportOrdersController();

import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { transportRepo } from "../repository/transport.repo";
import { towingRepo } from "../repository/towing.repo";

class TowingController {
  async createTowOrder(req: Request, res: Response) {
    try {
      const towOrder = await towingRepo.createOrder(req.body);
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

  
}

export const towingController = new TowingController();

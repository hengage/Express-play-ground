import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { earningsRepo } from "../repository/earnings.repo";

class EarningsController {
  async getEarnings(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) | 1;
    try {
      const user = (req as any).user._id;
      const earnings = await earningsRepo.getEarnings(user, page);
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: earnings,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed",
        error: error.message || "Server errror",
      });
    }
  }
}

export const earningController = new EarningsController()

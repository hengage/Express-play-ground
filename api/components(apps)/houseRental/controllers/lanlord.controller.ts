import { Request, Response } from "express";
import { handleErrorResponse } from "../../../utils";
import { landlordRepo } from "../repository/landlord.repo";
import { STATUS_CODES } from "../../../constants";

class LandlordController {
  async signup(req: Request, res: Response) {
    try {
      const landlord = await landlordRepo.signup(req.body);
      res.status(STATUS_CODES.CREATED).json({
        message: "success",
        data: { landlord },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const landlordController = new LandlordController();

import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { makuService } from "../services/maku.service";

class MakuController {
  public async getVehicleTypes(req: Request, res: Response) {
    try {
      const vehicleTypes = await makuService.getVehicleTypes();
      res.status(STATUS_CODES.OK).json({
        message: "Fetched cab types",
        data: {
          vehicleTypes,
        },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to fecth cab types",
        error: error.message,
      });
    }
  }

  async getTripDetails(req: Request, res: Response) {
    const { tripId } = req.params;
    try {
      const trip = await makuService.getTripDetails(tripId);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched trip details",
        data: { trip }
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to get trip details",
        error: error.message,
      });
    }
  }
}

export const makuController = new MakuController();

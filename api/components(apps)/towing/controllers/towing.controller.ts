import { Request, Response } from "express";
import { towingService } from "../services/towing.service";
import { STATUS_CODES } from "../../../constants";

class TowingController {
  async create(req: Request, res: Response) {
    try {
      const towingCompany = await towingService.create(req.body);
      res.status(STATUS_CODES.OK).json({
        message: "Created towing company",
        data: { towingCompany },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error creating towing company",
        error: error.message,
      });
    }
  }

  async addVehicleType(req: Request, res: Response) {
    const { towingCompanyId, towingVehicleTypeId } = req.body;
    try {
      await towingService.addVehicleType({
        towingCompanyId,
        towingVehicleTypeId,
      });
      res.status(STATUS_CODES.OK).json({
        message: "Added vehicle type",
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error adding vehicle type",
        error: error.message,
      });
    }
  }
}

export const towingController = new TowingController();

import { Request, Response } from "express";
import { towingService } from "../services/towing.service";
import { STATUS_CODES } from "../../../constants";
import { jwtUtils } from "../../../utils";

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

  async login(req: Request, res: Response) {
    try {
      const towingCompany = await towingService.login(req.body)
      const payload = {_id: towingCompany._id, phoneNumber: towingCompany.phoneNumber}
      const accessToken = jwtUtils.generateToken(payload, "1h");
      const refreshToken = jwtUtils.generateToken(payload, "14d");

      res.status(STATUS_CODES.OK).json({
        message: "Logged in",
        data: {
          _id: towingCompany._id,
          accessToken,
          refreshToken
        }
      })
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: "Failed to login",
        error: error.message
      })
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

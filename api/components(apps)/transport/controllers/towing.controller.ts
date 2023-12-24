import { Request, Response } from "express";
import { transportService } from "../services/transport.service";
import { STATUS_CODES } from "../../../constants";
import { jwtUtils } from "../../../utils";

class TowingController {
  async create(req: Request, res: Response) {
    try {
      const transportCompany = await transportService.create(req.body);
      res.status(STATUS_CODES.OK).json({
        message: "Created towing company",
        data: { transportCompany },
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
      const transportCompany = await transportService.login(req.body);
      const payload = {
        _id: transportCompany._id,
        phoneNumber: transportCompany.phoneNumber,
      };
      const accessToken = jwtUtils.generateToken(payload, "1h");
      const refreshToken = jwtUtils.generateToken(payload, "14d");

      res.status(STATUS_CODES.OK).json({
        message: "Logged in",
        data: {
          _id: transportCompany._id,
          accessToken,
          refreshToken,
        },
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: "Failed to login",
        error: error.message,
      });
    }
  }

  async addVehicle(req: Request, res: Response) {
    const { vehicle } = req.body;
    const towingCompanyId = (req as any).user._id;
    try {
      await transportService.addVehicle({ vehicle }, towingCompanyId);
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

  async addDriver(req: Request, res: Response) {
    const transportCompanyId = (req as any).user._id;
    try {
      const driver = await transportService.addDriver(req.body, transportCompanyId);
      res.status(STATUS_CODES.CREATED).json({
        message: "Added driver",
        data: { driver },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error adding driver",
        error: error.message,
      });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const _id = (req as any).user._id;
      const transportCompny = await transportService.getMe(_id);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched profile",
        data: {
          transportCompny
        }
      })
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error fetching profile",
        error: error.message || "Server error",
      });
    }
  }
}

export const towingController = new TowingController();
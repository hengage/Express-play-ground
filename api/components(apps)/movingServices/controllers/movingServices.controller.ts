import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { movingServicesService } from "../services/movingServices.service";
import { jwtUtils } from "../../../utils";

class MovingServicesController {
  async signup(req: Request, res: Response) {
    try {
      const movingService = await movingServicesService.signup(req.body);
      const payload = {
        _id: movingService._id,
        phoneNumber: movingService.phoneNumber,
      };
      const accessToken = jwtUtils.generateToken(payload, "2h");
      const refreshToken = jwtUtils.generateToken(payload, "14d");
      res.status(STATUS_CODES.CREATED).json({
        message: "Created successfully",
        data: {
          _id: movingService._id,
          accessToken,
          refreshToken,
        },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error signing up",
        error: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const movingService = await movingServicesService.login(req.body);
      const payload = {
        _id: movingService._id,
        phoneNumber: movingService.phoneNumber,
      };
      const accessToken = jwtUtils.generateToken(payload, "2h");
      const refreshToken = jwtUtils.generateToken(payload, "14d");
      res.status(STATUS_CODES.CREATED).json({
        message: "Created successfully",
        data: {
          _id: movingService._id,
          accessToken,
          refreshToken,
        },
      });
    } catch (error: any) {
      res.status(error.status || error.message).json({
        message: "Failed to login",
        error: error.message,
      });
    }
  }
}

export const movingServicesController = new MovingServicesController();

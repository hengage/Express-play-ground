import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { jwtUtils } from "../../../utils";
import { vehicleRentalService } from "../services/vehicleRental.services";

class VehicleRentalController {
  async signup(req: Request, res: Response) {
    try {
      const vehicleRental = await vehicleRentalService.signup(req.body);
      const payload = {
        _id: vehicleRental._id,
        phoneNumber: vehicleRental.phoneNumber,
      };
      const accessToken = jwtUtils.generateToken(payload, "2h");
      const refreshToken = jwtUtils.generateToken(payload, "14d");
      res.status(STATUS_CODES.CREATED).json({
        message: "Created successfully",
        data: {
          _id: vehicleRental._id,
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
      const vehicleRental = await vehicleRentalService.login(req.body);
      const payload = {
        _id: vehicleRental._id,
        phoneNumber: vehicleRental.phoneNumber,
      };
      const accessToken = jwtUtils.generateToken(payload, "2h");
      const refreshToken = jwtUtils.generateToken(payload, "14d");
      res.status(STATUS_CODES.CREATED).json({
        message: "Created successfully",
        data: {
          _id: vehicleRental._id,
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

  async addVehicle(req: Request, res: Response) {
    const { vehicle } = req.body
    const vehicleRentalId = (req as any).user._id
    try {
        await vehicleRentalService.addVehicle({vehicle}, vehicleRentalId)
        res.status(STATUS_CODES.OK).json({
            message: "Added vehicle"
        })
    } catch (error: any) {
        res.status(error.status || STATUS_CODES.SERVER_ERROR)
        .json({
            message: "Failed to add vehicle type",
            error: error.message || "Server error"
        })
    }
  }
}

export const vehicleRentalController = new VehicleRentalController();

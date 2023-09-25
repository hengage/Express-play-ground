import { Request, Response } from "express";
import { driverRiderService } from "../services/driversRiders.services";
import { jwtUtils } from "../../../utils";

class DriversRidersController {
  public async signup(req: Request, res: Response) {
    const accountType = req.query.accountType as string;
    try {
      if (!accountType) {
        return res.status(400).json({
          message: "Account type is required",
        });
      }
      const driverRider = await driverRiderService.signup(
        req.body,
        accountType
      );
      const payload = {
        phoneNumber: driverRider.phoneNumber,
        _id: driverRider._id,
      };
      const accessToken = jwtUtils.generateToken(payload, "1h");
      return res.status(201).json({
        message: "Account created successfully",
        data: {
        ...driverRider,
          accessToken,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        message: "Failed to create acount",
        error: error.message,
      });
    }
  }
}

export const driversRidersController = new DriversRidersController()
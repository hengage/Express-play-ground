import { Request, Response } from "express";
import { driverRiderService } from "../services/driversRiders.services";
import { HandleException, jwtUtils } from "../../../utils";
import { STATUS_CODES } from "../../../constants";
import { userService } from "../../../services";

class DriversRidersController {
  public async signup(req: Request, res: Response) {
    const accountType = req.query.accountType as string;
    try {
      if (!accountType) {
        return res.status(400).json({
          message: "Account type is required",
        });
      }

      await userService.isEmailTaken(req.body.email);
      await userService.isPhoneNumberTaken(req.body.phoneNumber);

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
          driverRider: {
            _id: driverRider.id,
            firstName: driverRider.name.firstName
          },
          accessToken,
        },
      });
    } catch (error: any) {
      return res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to create acount",
        error: error.message,
      });
    }
  }

  public async login(req: Request, res: Response) {
    const { phoneNumber, password } = req.body;

    try {
      const driverRider = await driverRiderService.login({
        phoneNumber,
        password,
      });
      const payload = {
        phoneNumber: driverRider.phoneNumber,
        _id: driverRider._id,
      };
      const accessToken = jwtUtils.generateToken(payload, "1h");
      return res.status(200).json({
        message: "Logged in",
        data: {
          ...driverRider,
          accessToken,
        },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to login",
        error: error.message,
      });
    }
  }
}

export const driversRidersController = new DriversRidersController();

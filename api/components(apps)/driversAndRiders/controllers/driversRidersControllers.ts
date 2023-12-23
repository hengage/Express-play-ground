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
      const refreshToken = jwtUtils.generateToken(payload, "14d");

      return res.status(201).json({
        message: "Account created successfully",
        data: {
          driverRider: {
            _id: driverRider.id,
            firstName: driverRider.firstName,
          },
          accessToken,
          refreshToken,
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
    const accountType = req.query.accountType as string;
    const { phoneNumber, password } = req.body;

    try {
      const driverRider = await driverRiderService.login(
        {
          phoneNumber,
          password,
        },
        accountType
      );

      const payload = {
        phoneNumber: driverRider.phoneNumber,
        _id: driverRider._id,
      };
      const accessToken = jwtUtils.generateToken(payload, "1h");
      const refreshToken = jwtUtils.generateToken(payload, "14d");

      return res.status(200).json({
        message: "Logged in",
        data: {
          ...driverRider,
          accessToken,
          refreshToken,
        },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to login",
        error: error.message,
      });
    }
  }

  async getMe(req: Request, res: Response) {
    const id = (req as any).user._id;
    try {
      const driverRider = await driverRiderService.getMe(id);
      res.status(STATUS_CODES.OK).json({
        message: `Successful`,
        data: { driverRider },
      });
    } catch (error: any) {
      res.status(error.status | STATUS_CODES.SERVER_ERROR).json({
        message: "Error getting details",
        error: error.message,
      });
    }
  }

  public async rateDriverOrRider(req: Request, res: Response) {
    const accountType = req.query.accountType;
    try {
      await driverRiderService.rateDriverOrRider(
        req.params.driverRiderId,
        req.body.rating,
        `${accountType}`
      );
      res.status(STATUS_CODES.OK).json({ message: `${accountType} rated` });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: `Error rating ${accountType}`,
        error: error.message,
      });
    }
  }

  async makuTripHistory(req: Request, res: Response) {
    const driverId = (req as any).user._id;
    try {
      const trips = await driverRiderService.makuTripHistory(driverId);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched trip history",
        data: { trips },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error fetching trip history",
        error: error.message || "Server error",
      });
    }
  }
}

export const driversRidersController = new DriversRidersController();

import { Request, Response } from "express";
import { vendorService } from "../services/vendors.services";
import { HandleException, jwtUtils } from "../../../utils";
import { STATUS_CODES } from "../../../constants";
import { userService } from "../../../services";
import { shopServices } from "../../shops";

class VendorController {
  public async signup(req: Request, res: Response) {
    try {
      await userService.isEmailTaken(req.body.email);

      await userService.isPhoneNumberTaken(req.body.phoneNumber);

      const vendor = await vendorService.signup(req.body);
      const payload = {
        phoneNumber: vendor.phoneNumber,
        _id: vendor._id,
      };
      const accessToken = jwtUtils.generateToken(payload, "1h");
      return res.status(201).json({
        message: "Account created successfully",
        data: {
          vendor: {
            _id: vendor._id,
            firstname: vendor.firstName,
            phoneNumber: vendor.phoneNumber,
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

  async login(req: Request, res: Response) {
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;

    try {
      const vendor = await vendorService.login({ phoneNumber, password });
      const payload = { phoneNumber: vendor.phoneNumber, _id: vendor._id };
      const accessToken = jwtUtils.generateToken(payload, "1h");
      res.status(200).json({
        message: "Successfully logged in",
        data: {
          ...vendor,
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

  async getShops(req: Request, res: Response) {
    try {
      const vendorId = (req as any).user._id
      const shops = await shopServices.getAllShopsForAVendor(vendorId);
      if (shops.length < 1) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          message: "You currently have no shop",
        });
      }
      res.status(STATUS_CODES.OK).json({
        message: `Fetched shops for vendor: ${vendorId}`,
        data: shops
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to fetch shops",
        error: error.message,
      });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const vendorId = (req as any).user._id;
      const vendor = await vendorService.getMe(vendorId);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched vendor profile",
        data: { vendor },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to get vendor profile",
        error: error.message,
      });
    }
  }

}

export const vendorController = new VendorController();

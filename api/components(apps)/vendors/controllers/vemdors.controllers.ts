import { Request, Response } from "express";
import { vendorService } from "../services/vendors.services";
import { HandleException, jwtUtils } from "../../../utils";
import { STATUS_CODES } from "../../../constants";
import { userService } from "../../../services";

class VendorController {
  public async signup(req: Request, res: Response) {
    console.log({vndorEmail: req.body.email})
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
}

export const vendorController = new VendorController();

import { Request, Response } from "express";
import { vendorService } from "../services/vendors.services";
import { jwtUtils } from "../../../utils";
import { STATUS_CODES } from "../../../constants";

class VendorController {
    public async signup(req: Request, res: Response) {
        try {
          const vendor = await vendorService.signup(
            req.body,
          );
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
                phoneNumber: vendor.phoneNumber
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

export const vendorController = new VendorController()
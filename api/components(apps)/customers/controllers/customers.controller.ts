import { Request, Response } from "express";
import { customerService } from "../services/customers.services";
import { userService } from "../../../services";
import { HandleException, jwtUtils } from "../../../utils";
import { STATUS_CODES } from "../../../constants";

class CustomerController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      await userService.isEmailTaken(req.body.email);
      await userService.isPhoneNumberTaken(req.body.phoneNumber);

      const customerData = req.body;
      const savedCustomer = await customerService.signup(customerData);

      const payload = {
        phoneNumber: savedCustomer.phoneNumber,
        _id: savedCustomer._id,
      };
      const accessToken = jwtUtils.generateToken(payload, "1h");

      res.status(201).json({
        message: "Customer created successfully",
        data: {
          customerId: savedCustomer._id,
          accessToken,
        },
      });
    } catch (error: any) {
      res
        .status(error.status || STATUS_CODES.SERVER_ERROR)
        .json({ message: "Error creating customer", error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;

    try {
      const customer = await customerService.login({ phoneNumber, password });
      const payload = { phoneNumber: customer.phoneNumber, _id: customer._id };
      const accessToken = jwtUtils.generateToken(payload, "1h");
      res.status(200).json({
        message: "Successfully logged in",
        data: {
          _id: customer._id,
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

  async getMe(req: Request, res: Response) {
    try {
      const user = jwtUtils.verifyToken(req) as { _id: string };
      const customer = await customerService.getMe(user._id);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched custommer profile",
        data: { customer },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to get customer profile",
        error: error.message
      });
    }
  }
}

export const customerController = new CustomerController();

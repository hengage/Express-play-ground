import { Request, Response } from "express";
import { customerService } from "../services/customer.services";
import { userService } from "../../../services";
import { HandleException } from "../../../utils";
import { STATUS_CODES } from "../../../constants";

class CustomerController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const emailTaken = await userService.isEmailTaken(req.body.email);
      if (emailTaken) {
        throw new HandleException(
          STATUS_CODES.CONFLICT,
          "Email is already taken"
        );
      }

      const phoneNumberTaken = await userService.isPhoneNumberTaken(
        req.body.phoneNumber
      );
      if (phoneNumberTaken) {
        throw new HandleException(
          STATUS_CODES.CONFLICT,
          "Phone number is already taken"
        );
      }

      const customerData = req.body;
      const savedCustomer = await customerService.signup(customerData);
      res.status(201).json(savedCustomer);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error creating customer", error: error.message });
    }
  }
}

export const customerController = new CustomerController();

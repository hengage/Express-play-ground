import bcrypt from "bcrypt";

import { Customer } from "../models/customers.models";
import { HandleException } from "../../../utils";
import { ICustomer, ISignupCustomer } from "../customers.interface";
import { ILoginCustomer } from "../customers.interface";
import { STATUS_CODES } from "../../../constants";

class CustomerService {
  async signup(payload: ISignupCustomer): Promise<any> {
    try {
      const newCustomer = new Customer({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: payload.password,
        photo: payload.photo,
        gender: payload.gender,
        address: {
          street: payload.street,
          city: payload.city,
          state: payload.state,
          country: payload.country,
          postalCode: payload.postalCode,
        },
      });
      const savedCustomer = await newCustomer.save();
      return savedCustomer;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async getCustomerByPhoneNumber(
    phoneNumber: string,
    selectFields?: string
  ): Promise<ICustomer> {
    try {
      const query = Customer.findOne({
        phoneNumber: { $eq: phoneNumber },
      });

      if (selectFields) {
        query.select(selectFields);
      }

      const customer = await query.exec();
      if (!customer) {
        throw new HandleException(404, "Customer not found");
      }
      return customer;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async login(payload: ILoginCustomer): Promise<any> {
    try {
      const customer = await this.getCustomerByPhoneNumber(
        payload.phoneNumber,
        "phoneNumber password"
      );

      const passwordsMatch = await bcrypt.compare(
        payload.password,
        customer.password
      );
      if (!passwordsMatch) {
        throw new HandleException(
          STATUS_CODES.UNAUTHORIZED,
          "Incorrect password"
        );
      }
      const loggedInCustomer = {
        _id: customer._id,
        phoneNumber: customer.phoneNumber,
      };

      return loggedInCustomer;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async getMe(id: string) {
    try {
      const customer = await Customer.findOne({ _id: id }).select(
        "-__v -password -updatedAt"
      );
      if (!customer) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          "Customer account not found"
        );
      }
      console.log({ customer });
      return customer;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const customerService = new CustomerService();

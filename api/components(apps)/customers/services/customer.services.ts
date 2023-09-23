import bcrypt from "bcrypt";

import { Customer } from "../models/customer.models";
import { HandleException } from "../../../utils";
import { ICustomer } from "../models/customer.models.interface";
import { ILoginCustomer } from "./customer.services.interface";

class CustomerService {
  async signup(customerData: any): Promise<any> {
    try {
      const newCustomer = new Customer({
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
        password: customerData.password,
        gender: customerData.gender,
        address: {
          street: customerData.street,
          city: customerData.city,
          state: customerData.state,
          postalCode: customerData.postalCode,
        },
      });
      const savedCustomer = await newCustomer.save();
      return savedCustomer;
    } catch (error: any) {
      throw new Error("Error creating customer: " + error.message);
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
        throw new HandleException(401, "Customer not found");
      }
      console.log({ customer });
      return customer;
    } catch (error: any) {
      throw new Error(error.message);
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
        throw new HandleException(401, "Incorrect password");
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
}

export const customerService = new CustomerService();

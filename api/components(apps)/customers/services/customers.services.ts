import bcrypt from "bcrypt";

import { Customer } from "../models/customers.models";
import { HandleException } from "../../../utils";
import { ICustomer, ISignupCustomer } from "../customers.interface";
import { ILoginCustomer } from "../customers.interface";
import { STATUS_CODES } from "../../../constants";
import { IOrder, Order } from "../../orders";

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
      return customer;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async getOrders(customerId: string, status?: string): Promise<IOrder[]> {
    try {
      const filter: { customer: string; status?: string } = {
        customer: customerId,
      };

      if (status) {
        filter.status = status;
      }

      const orders = await Order.find(filter)
      .select("-__v -updatedAt -customer")
      .populate({path: "items.product", select: "name photos sizes colors"})
      .populate({path: "items.shop", select: "name"})
      .lean()
      .exec();

      if (orders.length < 1) {
        if (status) {
          throw new HandleException(
            STATUS_CODES.NOT_FOUND,
            `You have no ${status} order.`
          );
        } else {
          throw new HandleException(
            STATUS_CODES.NOT_FOUND,
            "You have no order."
          );
        }
      }

      return orders;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async deleteAccount(customerId: string) {
    try {
      const result = await Customer.deleteOne({ _id: customerId });

      if (result.deletedCount === 0) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Customer not found");
      }
      console.log("Customer deleted successfully", customerId);
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const customerService = new CustomerService();

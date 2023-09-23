import { uniqueString } from "../../../utils";
import { Customer } from "../models/customer.models";

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

  async getCustomerByPhoneNumber(phoneNumber: string): Promise<any> {
    try {
      const customer = await Customer.findOne({
        phoneNumber: { $eq: phoneNumber },
      }).select('phoneNumber');
      console.log({customer})
      return customer
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const customerService = new CustomerService();

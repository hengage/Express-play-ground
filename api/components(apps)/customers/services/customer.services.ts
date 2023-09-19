import { Customer } from "../models/customer.models";

class CustomerService {
  async signup(customerData: any): Promise<any> {
    try {
      const newCustomer = new Customer({
        _id: 123,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
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
}

export const customerService = new CustomerService();

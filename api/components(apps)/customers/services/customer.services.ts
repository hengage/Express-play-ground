import { Customer } from "../models/customer.models";

class CustomerService {
  async signup(customerData: any): Promise<any> {
    try {
      const newCustomer = new Customer(customerData);
      const savedCustomer = await newCustomer.save();
      return savedCustomer;
    } catch (error: any) {
      throw new Error('Error creating customer: ' + error.message);
    }
  }
}

export const customerService = new CustomerService;

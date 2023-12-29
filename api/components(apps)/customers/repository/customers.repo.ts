import { ICustomer } from "../customers.interface";
import { Customer } from "../models/customers.models";

class CustomerRepository {
  async updateProfile(customerId: string, payload: Partial<ICustomer>) {
    const select = Object.keys(payload);
    select.push("-_id");

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $set: payload },
      { new: true }
    )
      .select(select)
      .lean();

    return customer;
  }
}

export const customerRepo = new CustomerRepository();
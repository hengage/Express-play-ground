import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Customer } from "../../customers";

class AdminOpsForCustomersService {
  async getCustomers(page: number) {
    const query = {};
    const options = {
      page,
      limit: 15,
      select: "firstName lastName email phoneNumber accountStatus createdAt",
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const customers = await Customer.paginate(query, options);
    return customers;
  }

  async getCustomerDetails(customerId: string) {
    const customer = await Customer.findById(customerId)
      .select("-__v -password")
      .lean();

    if (!customer) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Customer not found");
    }
    return customer;
  }
}
export const adminOpsForCustomersService = new AdminOpsForCustomersService();

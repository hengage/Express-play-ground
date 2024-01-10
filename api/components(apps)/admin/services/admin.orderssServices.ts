import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Order } from "../../orders";

class AdminOpsForOrdersService {
  async getOrders(page: number, status?: string) {
    const query: { status?: string } = {};

      if (status) {
        query.status = status;
      }

    const options = {
        skip: (page - 1) * 10,
        limit: 15,
        select: "-_id items.shop totalAmount status",
        populate: [
          { path: "rider", select: "firstName lastName" },
          { path: "customer", select: "firstName lastName" },
        ],
        sort: { createdAt: -1 },
      };

      const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .select(options.select)
      .populate(options.populate)
      .lean()
      .exec();

      return orders;
  }

  async getOrderDetails(orderId: string) {
    const order = await Order.findById(orderId)
    .select("-__v -updatedAt")
    .populate({path: "customer", select: "firstName lastName phoneNumber profilePhoto"})
    .populate({path: "rider", select: "firstName lastName phoneNumber photo"})
    .lean();

    if (!order) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Order not found");
    }

    return order;
  }
}

export const adminOpsForOrdersService = new AdminOpsForOrdersService();

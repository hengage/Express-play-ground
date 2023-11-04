import { HandleException } from "../../../utils";
import { Order } from "../models/orders.models";

class OrdersService {
  public async createOrder(payload: any) {
    try {
      const orderItems = payload.items.map((item: any) => {
        return {
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          shop: item.shop,
        };
      });

      const newOrder = new Order({
        customer: payload.customer,
        items: orderItems,
        totalAmount: payload.totalAmount,
      });

      await newOrder.save();

      const order = {
        _id: newOrder._id,
        cuatomer: newOrder.customer,
        items: newOrder.items,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        createdAt: newOrder.createdAt,
      };
      return order;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const ordersService = new OrdersService();

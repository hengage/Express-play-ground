import { HandleException } from "../../../utils";
import { Order } from "../models/orders.models";

class OrdersService {
  public async createOrder(payload: any, customerId: string) {
    console.log({customerId})
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
        customer: customerId,
        items: orderItems,
        totalAmount: payload.totalAmount,
      });
      console.log({newOrder})


      await newOrder.save();

      const order = {
        _id: newOrder._id,
        customer: newOrder.customer,
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

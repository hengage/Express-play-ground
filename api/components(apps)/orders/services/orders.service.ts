import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Order } from "../models/orders.models";
import { IOrder } from "../orders.interface";

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
        deliveryFee: payload.deliveryFee,
        deliveryAddress: payload.address,
        deliveryAddressCord: {
          coordinates: payload.coordinates
        },
        totalAmount: payload.totalPrice,
      });

      await newOrder.save();
      console.log('saved order', newOrder)
      const order = {
        _id: newOrder._id,
        customer: newOrder.customer,
        items: newOrder.items,
        deliveryFee: newOrder.deliveryFee,
        deliveryAddress: {
          address: newOrder.deliveryAddress,
        },
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        createdAt: newOrder.createdAt,
      };
      return order;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getOrder(orderId: string): Promise<IOrder> {
    try {
      const order = await Order.findById({ _id: orderId })
        .select("_id items totalAmount status createdAt")
        .lean();

      if (!order) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Order not found");
      }
      return order;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const ordersService = new OrdersService();

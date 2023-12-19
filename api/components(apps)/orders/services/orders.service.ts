import { OrderStatus, STATUS_CODES } from "../../../constants";
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
          size: item.size,
          color: item.color,
          shop: item.shop,
        };
      });

      const order = await  new Order({
        customer: payload.customer,
        items: orderItems,
        deliveryFee: payload.deliveryFee,
        deliveryAddress: payload.address,
        deliveryAddressCord: {
          coordinates: payload.coordinates,
        },
        productTotal: payload.productTotal,
        totalAmount: payload.totalPrice,
      }).save();

      return order._id;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getOrder(orderId: string): Promise<IOrder> {
    try {
      const order = await Order.findById({ _id: orderId })
        .select("-__v -updatedAt -deliveryAddressCord.type")
        .populate({ path: "items.product", select: "name photos" })
        .populate({
          path: "items.shop",
          select:
            "name  phoneNumber location.coordinates street city state country",
        })
        .populate({ path: "customer", select: "phoneNumber" })
        .lean();

      if (!order) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Order not found");
      }
      return order;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getOrderById(id: string, selectField?: string): Promise<IOrder> {
    try {
      const query = Order.findById(id);
      if (selectField) {
        query.select(selectField);
      }

      const order = await query.exec();

      if (!order) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          "The order was not found and might not exist"
        );
      }
      return order;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async setStatusToProcessing(id: string) {
    const order = await Order.findById(id).select("status").exec();
    if (order) {
      order.status = OrderStatus.PROCESSING;
      await order.save();
      console.log("order set to processing", { order });
    }
  }

  public prepareOrderDataForRider(order: IOrder) {
    return {
      orderId: order._id,
      // shop: order.items.map((item) => item.shop)[0],
      shop: order.items.reduce((acc: any, item: any) => {
        acc = item.shop;
        return acc;
      }, {}),
      customer: order.customer,
      deliveryAddress: {
        address: order.deliveryAddress,
        coordinates: order.deliveryAddressCord.coordinates,
      },
    };
  }

  async assignRider(orderId: string, riderId: string) {
    const order = await ordersService.getOrderById(orderId, "rider");
    order.rider = riderId;
    await order.save();
  }
}

export const ordersService = new OrdersService();

import {
  MessengerOrderStatus,
  OrderStatus,
  STATUS_CODES,
} from "../../../constants";
import { HandleException } from "../../../utils";
import { DriverRider } from "../../driversAndRiders";
import { IMessengerOrder } from "../messenger.interface";
import { MessengerOrder } from "../models/messenger.models";

class MessengerRepo {
  async createOrder(payload: any) {
    const order = await new MessengerOrder({
      customer: payload.customer,
      packageType: payload.packageType,
      pickUpAddress: payload.pickUpAddress,
      pickUpLocation: {
        coordinates: payload.pickUpCoordinates,
      },
      dropOffAddress: payload.dropOffAddress,
      dropOffLocation: {
        coordinates: payload.dropOffCoordinates,
      },
      note: payload.note,
      deliveryCost: payload.deliveryCost,
      scheduledPickUpTime: payload.scheduledPickUpTime,
    }).save();

    console.log({ Order_created: order });
    return order;
  }

  async getOrder(orderId: string): Promise<IMessengerOrder> {
    const order = await MessengerOrder.findById(orderId)
      .select("-__v -updatedAt")
      .populate({ path: "customer", select: "firstName lastName phoneNumber" })
      .populate({ path: "rider", select: "firstName lastName phoneNumber" })
      .populate({ path: "packageType", select: "packageType" })
      .lean()
      .exec();

    if (order) {
      return order;
    }
    throw new HandleException(STATUS_CODES.NOT_FOUND, "Order not found");
  }

  async assignRider(orderId: string, riderId: string) {
    const messengerOrder = await MessengerOrder.findById(orderId).select(
      "rider customer"
    );
    const rider = await DriverRider.findById(riderId).select("_id").lean();

    if (messengerOrder && rider) {
      messengerOrder.rider = rider._id;
      await messengerOrder.save();
    }

    return messengerOrder
  }

  async setStatusToPickedUp(orderId: string) {
    const order = await MessengerOrder.findById(orderId).select(
      "status customer"
    );
    if (order) {
      order.status = MessengerOrderStatus.PICKED_UP;
      await order.save();
    }
    return order;
  }

  async setStatusToArrived(orderId: string) {
    const order = await MessengerOrder.findById(orderId).select(
      "status customer"
    );
    if (order) {
      order.status = MessengerOrderStatus.ARRIVED;
      await order.save();
    }
    return order;
  }

  async setStatusToDelivered(orderId: string) {
    const order = await MessengerOrder.findById(orderId).select(
      "status customer"
    );
    if (order) {
      order.status = MessengerOrderStatus.DELIVERED;
      await order.save();
    }

    return order;
  }
}

export const messengerRepo = new MessengerRepo();

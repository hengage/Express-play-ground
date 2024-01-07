import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
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
      .populate({ path: "packageType", select: "packageType" })
      .lean();
    if (order) {
      return order;
    }
    throw new HandleException(STATUS_CODES.NOT_FOUND, "Order not found");
  }
}

export const messengerRepo = new MessengerRepo();

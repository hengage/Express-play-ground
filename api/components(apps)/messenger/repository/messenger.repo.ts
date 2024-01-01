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

    console.log({Order_created: order})
    return order
  }
}

export const messengerRepo = new MessengerRepo()
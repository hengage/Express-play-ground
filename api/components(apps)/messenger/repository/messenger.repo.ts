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
      scheduledPickUpTime: new Date(payload.scheduledPickUpTime),
    }).save();

    return order
  }
}

export const messengerRepo = new MessengerRepo()
import { MessengerOrder } from "../../messenger";

class RidersService {
  async messengerOrderHistory(riderId: string, page: number) {
    const query = { customer: riderId };
    const options = {
      page,
      limit: 20,
      select: "_id pickUpAddress dropOffAddress deliveryCost status createdAt",
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const messengerOrders = await MessengerOrder.paginate(query, options);

    return messengerOrders;
  }
}

export const ridersService = new RidersService();

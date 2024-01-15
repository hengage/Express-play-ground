import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { TowOrder } from "../models/transportOrders.model";
import { ITowingOrder } from "../transport.interface";

class TowingRepo {
  async createOrder(payload: any): Promise<ITowingOrder["_id"]> {
    const towOrder = await TowOrder.create({
      customer: payload.customer,
      transportCompany: payload.transportCompany,
      vehicleType: payload.vehicleType,
      pickUpAddress: payload.pickUpAddress,
      pickUpCoordinates: {
        coordinates: payload.pickUpCoordinates,
      },
      destinationAddress: payload.destinationAddress,
      destinationCoordinates: {
        coordinates: payload.destinationCoordinates,
      },
    });

    return towOrder._id;
  }

  async getOrdersHistoryForCompany(companyId: string, page: number) {
    const query = { transportCompany: companyId };

    const options = {
      page,
      limit: 20,
      select: "createdAt status",
      populate: [
        { path: "customer", select: "firstName lastName" },
        { path: "vehicleType", select: "vehicleType" },
      ],
      lean: true,
      leanWithId: false,
    };

    const towOrders = TowOrder.paginate(query, options);
    return towOrders;
  }

  async getOrderDetails(orderId: string) {
    const towOrder = await TowOrder.findById(orderId)
    .select("pickUpAddress destinationAddress fee status createdAt")
    .populate({path: "customer", select: "firstName lastName phoneNumber"})
    .populate({path: "transportCompany", select: "name phoneNumber address"})
    .populate({path: "vehicleType", select: "vehicleType"})
    .lean()
    .exec()

    if (!towOrder) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Tow order not found");
    }
    return towOrder;
  }
}

export const towingRepo = new TowingRepo();

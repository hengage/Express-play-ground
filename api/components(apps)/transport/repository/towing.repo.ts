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
          } 
        });
    
        return towOrder._id;
      }
}

export const towingRepo = new TowingRepo();
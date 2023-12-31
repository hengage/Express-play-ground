import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { TransportCompany } from "../models/transport.models";
import { TransportDriver } from "../models/transportDrivers.model";
import { TowOrder, TransportTripOrder } from "../models/transportOrders.model";
import {
  ITowingOrder,
  ITransportCompany,
  ITransportDriver,
} from "../transport.interface";

class TransportRepository {
  async updateDriver(
    driverId: string,
    transportCompanyId: string,
    payload: Partial<ITransportDriver>
  ) {
    // const select = Object.keys(payload);
    // select.push("-_id");

    const projection: Record<string, number | boolean | object> = {};
    Object.keys(payload).forEach((key) => {
      projection[key] = 1;
    });
    projection["_id"] = 0;

    const driver = await TransportDriver.findOneAndUpdate(
      { _id: driverId, transportCompany: transportCompanyId },
      { $set: payload },
      { new: true }
    )
      .select(projection)
      .lean();

    if (!driver) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Driver not found");
    }

    return driver;
  }

  async deleteDriver(driverId: string, transportCompanyId: string) {
    const result = await TransportDriver.deleteOne({
      _id: driverId,
      transportCompany: transportCompanyId,
    });
    if (result.deletedCount === 0) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Could not find driver to delete"
      );
    }
  }

  async updateProfile(id: string, payload: Partial<ITransportCompany>) {
    const select = Object.keys(payload);
    select.push("-_id");

    const transportCompany = await TransportCompany.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    )
      .select(select)
      .lean();

    if (!transportCompany) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Profile not found");
    }

    return transportCompany;
  }

  async createTowOrder(payload: any): Promise<ITowingOrder["_id"]> {
    const towOrder = await TowOrder.create({
      customer: payload.customer,
      transportCompany: payload.transportCompany,
      vehicleType: payload.vehicleType,
      pickUpAddress: payload.pickUpAddress,
      pickUpCoordinates: payload.pickUpCoordinates,
      destinationAddress: payload.destinationAddress,
      destinationCoordinates: payload.destinationCoordinates,
    });

    return towOrder._id;
  }

  async createTransportOrder(payload: any): Promise<ITowingOrder["_id"]> {
    const transportTripOrder = await TransportTripOrder.create({
      customer: payload.customer,
      transportCompany: payload.transportCompany,
      serviceType: payload.service,
      vehicleType: payload.vehicleType,
      pickUpAddress: payload.pickUpAddress,
      pickUpCoordinates: payload.pickUpCoordinates,
      destinationAddress: payload.destinationAddress,
      destinationCoordinates: payload.destinationCoordinates,
    });

    return transportTripOrder._id;
  }
}

export const transportRepo = new TransportRepository();

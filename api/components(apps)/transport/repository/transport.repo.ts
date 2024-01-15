import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { TransportCompany } from "../models/transport.models";
import { TransportDriver } from "../models/transportDrivers.model";
import { TowOrder, TransportTripOrder } from "../models/transportOrders.model";
import {
  ITowingOrder,
  ITransportCompany,
  ITransportDriver,
  ITransportTripOrder,
} from "../transport.interface";

class TransportRepository {
  async createCompany(payload: any) {
    const companyExist = await TransportCompany.findOne({
      name: payload.name,
    })
      .select("name")
      .lean();
    if (companyExist) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "Company already exists. Contact admin if this company belongs to you"
      );
    }

    const transportCompany = await new TransportCompany({
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      password: payload.password,
      address: payload.address,
      location: {
        coordinates: payload.coordinates,
      },
      serviceType: payload.serviceType,
    }).save();

    return {
      _id: transportCompany._id,
      name: transportCompany.name,
    };
  }

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

  async createTransportOrder(payload: any): Promise<Partial<ITransportTripOrder>> {
    const tripOrder = await TransportTripOrder.create({
      customer: payload.customer,
      transportCompany: payload.transportCompany,
      serviceType: payload.serviceType,
      vehicleType: payload.vehicleType,
      pickUpAddress: payload.pickUpAddress,
      pickUpCoordinates: {
        coordinates: payload.pickUpCoordinates
      },
      destinationAddress: payload.destinationAddress,
      destinationCoordinates: {
        coordinates: payload.destinationCoordinates
      },
    });

    return tripOrder
  }
}

export const transportRepo = new TransportRepository();

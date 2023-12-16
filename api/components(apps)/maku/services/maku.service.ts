import { MakuCabStatus } from "../../../constants";
import { findClosestDriverOrRider } from "../../../services";
import { HandleException } from "../../../utils";
import { Trip, VehicleType } from "../models/maku.model";

class MakuService {
  public async getVehicleTypes() {
    try {
      const vehicleTypes = await VehicleType.find({})
        .select("-__v")
        .lean()
        .exec();
      return vehicleTypes;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async findNearestDrivers(pickupCoordinates: [number, number]) {
    try {
      const drivers = await findClosestDriverOrRider(
        pickupCoordinates,
        "driver",
        10
      );
      return drivers;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async createTrip(payload: any) {
    try {
      const trip = await new Trip({
        customer: payload.customer,
        driver: payload.driver,
        pickUpAddress: payload.pickUpAddress,
        pickUpCoordinates: {
          coordinates: payload.pickUpCoordinates,
        },
        destinationAddress: payload.destinationAddress,
        destinationCoordinates: {
          coordinates: payload.destinationCoordinates,
        },
        vehicleType: payload.vehicleType,
      }).save();

      return trip;
    } catch (error: any) {
      throw new HandleException(error, error.message);
    }
  }

  async startTrip(tripId: string) {
    await Trip.findByIdAndUpdate(tripId, {
      $set: { status: MakuCabStatus.STARTED },
    }).select('status');
  }
}

export const makuService = new MakuService();

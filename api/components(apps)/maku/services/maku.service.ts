import { MakuCabStatus } from "../../../constants";
import { findClosestDriverOrRider } from "../../../services";
import { HandleException } from "../../../utils";
import { notificationService } from "../../notifications";
import { MakuTrip, VehicleType } from "../models/maku.model";

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

  async findNearestDrivers(
    pickUpCoordinates: [number, number],
    pickUpAddress: string,
    destinationCoordinates: [number, number],
    destinationAddress: string,
    customer: string,
    searchKMLimit: number,
    vehicleType?: string
  ) {
    try {
      const drivers = await findClosestDriverOrRider(
        pickUpCoordinates,
        "driver",
        searchKMLimit,
        vehicleType
      );
      drivers.forEach((driver) => {
        notificationService.noitifyDriversOfMakuRequest(
          driver._id,
          {
            pickUpCoordinates,
            pickUpAddress,
            destinationAddress, 
            destinationCoordinates, 
            customer,
            vehicleType
          }
        );
      });
      return drivers;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async createTrip(payload: any) {
    try {
      const trip = await new MakuTrip({
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

  async driverArrivedLocation(tripId: string) {
    await MakuTrip.findByIdAndUpdate(tripId, {
      $set: { status: MakuCabStatus.ARRIVED_PICKUP_LOCATION },
    }).select("status");
  }

  async startTrip(tripId: string) {
    await MakuTrip.findByIdAndUpdate(tripId, {
      $set: { status: MakuCabStatus.STARTED },
    }).select("status");
  }

  async completeTrip(tripId: string) {
    await MakuTrip.findByIdAndUpdate(tripId, {
      $set: { status: MakuCabStatus.COMPLETED },
    }).select("status");
  }

  async cancelTrip(tripId: string) {
    await MakuTrip.findByIdAndUpdate(tripId, {
      $set: { status: MakuCabStatus.CANCELLED },
    }).select("status");
  }
}

export const makuService = new MakuService();

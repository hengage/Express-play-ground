import { MakuCabStatus } from "../../../constants";
import { findClosestDriverOrRider } from "../../../services";
import { HandleException } from "../../../utils";
import { notificationService } from "../../notifications";
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

  async findNearestDrivers(
    pickupCoordinates: [number, number],
    pickUpAddress: string,
    destinationAddress: string,
    searchKMLimit: number
  ) {
    console.log({pickupCoordinates, pickUpAddress, destinationAddress, searchKMLimit})
    try {
      const drivers = await findClosestDriverOrRider(
        pickupCoordinates,
        "driver",
        searchKMLimit
      );
      drivers.forEach((driver) => {
        notificationService.noitifyDriversOfMakuRequest(
          driver._id,
          {
            destinationAddress, 
            pickUpAddress
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
    }).select("status");
  }

  async completeTrip(tripId: string) {
    await Trip.findByIdAndUpdate(tripId, {
      $set: { status: MakuCabStatus.COMPLETED },
    }).select("status");
  }

  async cancelTrip(tripId: string) {
    await Trip.findByIdAndUpdate(tripId, {
      $set: { status: MakuCabStatus.CANCELLED },
    }).select("status");
  }
}

export const makuService = new MakuService();

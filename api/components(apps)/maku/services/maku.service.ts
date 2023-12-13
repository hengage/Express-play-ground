import { findClosestDriverOrRider } from "../../../services";
import { HandleException } from "../../../utils";
import { VehicleType } from "../models/maku.model";

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
}

export const makuService = new MakuService();

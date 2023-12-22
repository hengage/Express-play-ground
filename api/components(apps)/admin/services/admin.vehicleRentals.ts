import { VehicleRentalVehicleType } from "../../vehicleRental";

class AdminVehicleRentalOperationService {
  async createVehicleType(payload: any) {
    const vehicleType = await new VehicleRentalVehicleType({
      name: payload.name,
    }).save();

    return vehicleType._id
  }
}

export const adminVCehicleRentalOperationService =
  new AdminVehicleRentalOperationService();

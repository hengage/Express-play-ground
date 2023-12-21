import { MovingServiceVehicleType } from "../../movingServices";

class AdminMovingServicesOperationService {
  async createMovingServiceVehicleType(payload: any) {
    const vehicleType = await new MovingServiceVehicleType({
      name: payload.name,
    }).save();

    return vehicleType._id
  }
}

export const adminMovingServicesOperationService =
  new AdminMovingServicesOperationService();

import { TowingVehicleType } from "../../towing";

class AdminTowingService {
  async createTowingVehicleType(payload: any) {
    console.log(payload)
    const towingVehicleType = await new TowingVehicleType({
      vehicleType: payload.vehicleType,
      feePerKM: payload.feePerKM,
      towingCompanyPercentage: payload.towingCompanyPercentage,
    }).save();

    return towingVehicleType
  }
}

export const adminTowingService = new AdminTowingService()

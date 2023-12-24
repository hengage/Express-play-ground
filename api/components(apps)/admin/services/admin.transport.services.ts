import { TransportVehicleType } from "../../transport";

class AdminTransportService {
  async createTowingVehicleType(payload: any) {
    console.log(payload)
    const transportVehicleType = await new TransportVehicleType({
      vehicleType: payload.vehicleType,
      feePerKM: payload.feePerKM,
      towingCompanyPercentage: payload.towingCompanyPercentage,
    }).save();

    return transportVehicleType
  }
}

export const adminTransportService = new AdminTransportService()

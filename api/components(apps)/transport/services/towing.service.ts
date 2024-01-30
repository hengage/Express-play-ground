import {
  TransportCompany,
  TransportVehicleType,
} from "../models/transport.models";
import { towingRepo } from "../repository/towing.repo";

class TowingService {
  async findTowingCompanies(coordinates: [number, number]) {
    const towingCompanies = await towingRepo.findTowingCompanies(coordinates);
    return towingCompanies;
  }

  async getTowingServiceVehicleTypes() {
    const vehicleTypes = TransportVehicleType.find({
      serviceType: "c6a56821",
    })
      .select("vehicleType feePerKM transportCompanyPercentage photo")
      .lean()
      .exec();

    return vehicleTypes;
  }
}

export const towingService = new TowingService();

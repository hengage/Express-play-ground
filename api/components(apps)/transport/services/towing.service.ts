import { TransportCompany, TransportVehicleType } from "../models/transport.models";

class TowingService {
  async findTowingCompanies() {
    const towingCompanies = await TransportCompany.find({
      serviceType: "c6a56821",
    })
      .select("_id name location.coordinates phoneNumber serviceType vehicleRegNumber")
      .lean();
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

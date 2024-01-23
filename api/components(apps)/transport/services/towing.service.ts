import { TransportCompany } from "../models/transport.models";

class TowingService {
  async findTowingCompanies() {
    const towingCompanies = await TransportCompany.find({
      serviceType: "c6a56821",
    })
      .select("_id name location.coordinates phoneNumber serviceType vehicleRegNumber")
      .lean();
    return towingCompanies;
  }
}

export const towingService = new TowingService();

import {
  TransportCompany,
  TransportVehicleType,
} from "../models/transport.models";

class TowingService {
  async findTowingCompanies(coordinates: [number, number]) {
    const towingCompanies = await TransportCompany.find({
      location: {
        $near: {
          $geometry: { type: "point", coordinates },
          $maxDistance: 9000,
        },
      },
      serviceType: "c6a56821",
    })
      .select(
        "name phoneNumber location.coordinates vehicleType vehicleRegNumber"
      )
      .lean()
      .exec();

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

import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { TowingCompany } from "../models/towing.models";

class TowingService {
  async create(payload: any) {
    const towingCompany = await new TowingCompany({
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      password: payload.password,
      address: payload.address,
      location: {
        coordinates: payload.coordinates,
      },
    }).save();

    return {
      _id: towingCompany._id,
      name: towingCompany.name,
    };
  }

  async addVehicleType(payload: any) {
    const towingCompany = await TowingCompany.findById(
      payload.towingCompanyId
    ).select("vehicleType");

    if (!towingCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Towing company not found"
      );
    }

    towingCompany.vehicleType.push(payload.towingVehicleTypeId);
    towingCompany.save();
    return;
  }
}

export const towingService = new TowingService();

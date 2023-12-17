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
}

export const towingService = new TowingService();

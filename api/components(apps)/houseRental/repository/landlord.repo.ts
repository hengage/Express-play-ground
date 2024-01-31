import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
import { ILandlordDocument } from "../houseRental.interface";
import { Landlord } from "../models/lanlord.model";

class LandlordRepository {
  async signup(payload: any): Promise<Partial<ILandlordDocument>> {
    const landlord = await Landlord.create(payload);

    return {
      _id: landlord._id,
      phoneNumber: landlord.phoneNumber,
      email: landlord.email,
      profilePhoto: landlord.profilePhoto,
      address: landlord.address,
      govtIdPhoto: landlord.govtIdPhoto,
    };
  }

  async login(payload: { phoneNumber: string; password: string }) {
    const landlord = await Landlord.findOne({
      phoneNumber: payload.phoneNumber,
    }).select("phoneNumber password");

    if (!landlord) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "No Landlord found");
    }

    const passwordsMatch = encryption.compareValues(
      payload.password,
      landlord.password
    );

    if (!passwordsMatch) {
      throw new HandleException(STATUS_CODES.BAD_REQUEST, "Incorrect password");
    }

    return landlord;
  }
}

export const landlordRepo = new LandlordRepository();

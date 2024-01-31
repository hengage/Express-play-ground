import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
import { Landlord } from "../models/lanlord.model";

class LandlordRepository {
  async signup(payload: any) {
    const landlord = await Landlord.create(payload);

    return landlord;
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

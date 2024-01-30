import { Landlord } from "../models/lanlord.model";

class LandlordRepository {
  async signup(payload: any) {
    const landlord = await Landlord.create(payload);

    return landlord;
  }
}

export const landlordRepo = new LandlordRepository();

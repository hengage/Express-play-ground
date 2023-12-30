import { MakuTrip } from "../../maku";

class DriversService {
  async getMakuTripDetails(driverId: string, tripId: string) {
    const trip = await MakuTrip.findOne({ _id: tripId, driver: driverId })
      .select({
        updatedAt: 0,
        __v: 0,
        driver: 0,
        "destinationCoordinates.locationType": 0,
        "pickUpCoordinates.locationType": 0,
      })
      .populate({
        path: "customer",
        select: "firstName lastName photo phoneNumber",
      })
      .lean()
      .exec();
    return trip;
  }
}

export const driversService = new DriversService();

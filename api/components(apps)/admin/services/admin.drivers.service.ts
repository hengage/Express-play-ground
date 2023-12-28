import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { DriverRider } from "../../driversAndRiders";

class AdminDriversService {
  async getDrivers(page: number) {
    const query = { accountType: "driver" };
    const options = {
      page,
      limit: 15,
      select: "firstName lastName email phoneNumber accountStatus createdAt",
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const drivers = await DriverRider.paginate(query, options);
    return drivers;
  }

  async getDriverById(driverId: string) {
    const driver = await DriverRider.findById(driverId)
      .select("-middleName -__v -updatedAt -location -accountType -password")
      .lean();

    if(!driver) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Driver not found");
    }
    return driver;
  }
}

export const adminDriversService = new AdminDriversService();

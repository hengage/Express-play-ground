import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { DriverRider, IDriverRider } from "../../driversAndRiders";

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

  async getDriverDetails(driverId: string) {
    const driver = await DriverRider.findOne({
      _id: driverId,
      accountType: "driver",
    })
      .select("-middleName -__v -updatedAt -location -accountType -password")
      .lean();

    if (!driver) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Driver not found");
    }
    return driver;
  }

  async updateDriver(driverId: string, payload: Partial<IDriverRider>) {
    const select = Object.keys(payload);
    select.push("-_id");

    const rider = await DriverRider.findByIdAndUpdate(
      driverId,
      { $set: payload },
      { new: true }
    )
      .select(select)
      .lean();

    if (!rider) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Driver not found");
    }

    return rider;
  }

  async deleteDriver(driverId: string) {
    const result = await DriverRider.deleteOne({
      _id: driverId,
      accountType: "driver",
    });

    if (result.deletedCount === 0) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Driver not found");
    }
  }

  async getUnapprovedDrivers(page: number) {
    const query = { accountType: "driver", approved: false };
    const options = {
      page,
      limit: 15,
      select:
        "firstName lastName email phoneNumber accountStatus approved createdAt",
      lean: true,
      leanWithId: false,
      sort: { createdAt: 1 },
    };

    const drivers = await DriverRider.paginate(query, options);
    return drivers;
  }

  async approveDriver(driverId: string) {
    const driver = await DriverRider.findOne({
      _id: driverId,
      accountType: "driver",
    }).select("approved");

    if (!driver) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Driver not found");
    }

    driver.approved = true;
    await driver.save();
  }
}

export const adminDriversService = new AdminDriversService();

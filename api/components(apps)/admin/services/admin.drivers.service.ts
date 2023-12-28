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
}

export const adminDriversService = new AdminDriversService();

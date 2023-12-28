import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { DriverRider } from "../../driversAndRiders";

class AdminRidersService {
    async getRiders(page: number) {
      const query = { accountType: "rider" };
      const options = {
        page,
        limit: 15,
        select: "firstName lastName email phoneNumber accountStatus createdAt",
        lean: true,
        leanWithId: false,
        sort: { createdAt: -1 },
      };
  
      const riders = await DriverRider.paginate(query, options);
      return riders;
    }
  
    async getRiderById(riderId: string) {
      const rider = await DriverRider.findById(riderId)
        .select("-middleName -__v -updatedAt -location -accountType -password")
        .lean();
  
      if(!rider) {
          throw new HandleException(STATUS_CODES.NOT_FOUND, "Rider not found");
      }
      return rider;
    }
  }
  
  export const adminRidersService = new AdminRidersService();
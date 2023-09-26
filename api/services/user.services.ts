import { Customer } from "../components(apps)/customers";
import { DriverRider } from "../components(apps)/driversAndRiders";

class UserService {
  public async isEmailTaken(email: string) {
    const customer = await Customer.findOne({
      email: { $eq: email },
    }).select("email");
    const driverRider = await DriverRider.findOne({ email }).select("email");
    // const vendor = await Vendor.findOne({ email });
    return !!customer || !!driverRider;
    //   return !!customer || !!driver || !!vendor;
  }

  public async isPhoneNumberTaken(phoneNumber: string) {
    const customer = await Customer.findOne({
      phoneNumber: { $eq: phoneNumber },
    }).select("phoneNumber");
    const driverRider = await DriverRider.findOne({ phoneNumber }).select(
      "phoneNumber"
    );
    // const vendor = await Vendor.findOne({ email });
    return !!customer || !!driverRider;;
    //   return !!customer || !!driver || !!vendor;
  }
}

export const userService = new UserService();

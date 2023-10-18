import { Customer } from "../components(apps)/customers";
import { DriverRider } from "../components(apps)/driversAndRiders";
import { Vendor } from "../components(apps)/vendors";

class UserService {
  public async isEmailTaken(email: string) {
    console.log({ email: email });
    const customer = await Customer.findOne({
      email: { $eq: email },
    }).select("email");
    const driverRider = await DriverRider.findOne({ email }).select("email");
    const vendor = await Vendor.findOne({ email }).select("email");
    console.log({ customer });
    console.log({ vendor });
    return !!customer || !!driverRider || !!vendor;
  }

  public async isPhoneNumberTaken(phoneNumber: string) {
    console.log({ phoneNumber });
    const customer = await Customer.findOne({
      phoneNumber: { $eq: phoneNumber },
    }).select("phoneNumber");
    const driverRider = await DriverRider.findOne({ phoneNumber }).select(
      "phoneNumber"
    );
    const vendor = await Vendor.findOne({ phoneNumber }).select("phoneNumber");
    return !!customer || !!driverRider || !!vendor;
  }
}

export const userService = new UserService();

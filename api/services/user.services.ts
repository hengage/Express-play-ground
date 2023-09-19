import { Customer } from "../components(apps)/customers";

class UserService {
  public async isEmailTaken(email: string) {
    const customer = await Customer.findOne({
      email: { $eq: email },
    }).select("email");
    // const driver = await Driver.findOne({ email });
    // const vendor = await Vendor.findOne({ email });
    return !!customer;
    //   return !!customer || !!driver || !!vendor;
  }
  
  public async isPhoneNumberTaken(phoneNumber: string) {
    const customer = await Customer.findOne({
      phoneNumber: { $eq: phoneNumber },
    }).select("phoneNumber");
    // const driver = await Driver.findOne({ email });
    // const vendor = await Vendor.findOne({ email });
    return !!customer;
    //   return !!customer || !!driver || !!vendor;
  }

  
}

export const userService = new UserService();

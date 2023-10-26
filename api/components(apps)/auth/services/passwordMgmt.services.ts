import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Customer } from "../../customers";
import { DriverRider } from "../../driversAndRiders";
import { Vendor } from "../../vendors";

class PasswordMgmtService {
  async resetPassword(
    phoneNumber: string,
    newPassword: string,
    userType: string
  ) {
    const UserModel = await this.getUserModel(userType);
    const user = await (UserModel as any).findOne({ phoneNumber });
    if (!user) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "User not found");
    }

    user.password = newPassword;
    user.save();
  }

  private async getUserModel(userType: string) {
    switch (userType) {
      case "customer":
        return Customer;
      case "vendor":
        return Vendor;
      case "driver-rider":
        return DriverRider;
      default:
        throw new Error("Invalid user type");
    }
  }
}

export const passwordMgmtService = new PasswordMgmtService();

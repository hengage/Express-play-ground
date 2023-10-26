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
    console.log({user})
    if (!user) {
      throw new Error("Invalid or expired reset token");
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
        console.log({DriverRider})
        return DriverRider;
      default:
        throw new Error("Invalid user type");
    }
  }
}

export const passwordMgmtService = new PasswordMgmtService();

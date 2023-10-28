import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
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

  public async changePassword(userId: string, newPassword: string, userType: string) {
    try {
      const UserModel = await this.getUserModel(userType);
      const user = await (UserModel as any).findById(userId);

      const currentPasswordMatch = await encryption.compareValues(
        newPassword,
        user.password
      );

      if (!currentPasswordMatch) {
        throw new HandleException(
          STATUS_CODES.BAD_REQUEST,
          "Incorrect password"
        );
      }
      user.password = newPassword
      user.save();
      return;
    } catch (error: any) {
        throw new HandleException(error.status, error.message);
    }
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

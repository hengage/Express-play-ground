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

  public async changePassword(accountId: string, currentPassword: string, newPassword: string, accountType: string) {
    try {
      const UserModel = await this.getUserModel(accountType);
      const account = await (UserModel as any).findById(accountId);
      console.log({currentPassword})

      if (!account) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "User not found");
      }

      const currentPasswordMatch = await encryption.compareValues(
        currentPassword,
        account.password
      );

      if (!currentPasswordMatch) {
        throw new HandleException(
          STATUS_CODES.BAD_REQUEST,
          "Your current password is incorrect"
        );
      }
      account.password = newPassword
      account.save();
      return;
    } catch (error: any) {
        throw new HandleException(error.status, error.message);
    }
  }

  private async getUserModel(accountType: string) {
    switch (accountType) {
      case "customer":
        return Customer;
      case "vendor":
        return Vendor;
      case "driver-rider":
        return DriverRider;
      default:
        throw new Error("Invalid account type");
    }
  }
}

export const passwordMgmtService = new PasswordMgmtService();

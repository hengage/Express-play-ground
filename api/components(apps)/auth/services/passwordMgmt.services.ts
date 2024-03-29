import { STATUS_CODES } from "../../../constants";
import { userService } from "../../../services";
import { HandleException, encryption } from "../../../utils";

class PasswordMgmtService {
  async resetPassword(
    phoneNumber: string,
    newPassword: string,
    accountType: string
  ) {
    const AccountModel = await userService.getUserAccountModel(accountType);
    const account = await (AccountModel as any).findOne({ phoneNumber });
    if (!account) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "User not found");
    }

    account.password = newPassword;
    account.save();
  }

  public async changePassword(
    accountId: string,
    currentPassword: string,
    newPassword: string,
    accountType: string
  ) {
    try {
      const AccountModel = await userService.getUserAccountModel(accountType);
      const account = await (AccountModel as any).findById(accountId);

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
      account.password = newPassword;
      account.save();
      return;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const passwordMgmtService = new PasswordMgmtService();

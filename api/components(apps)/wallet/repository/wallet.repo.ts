import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Earnings, Wallet } from "../models/wallet.models";
import { IRecordEarnings, IWithdrawalDetails } from "../wallet.interface";

class WalletRepository {
  async create(payload: { userId: string; accountType: string }) {
    const wallet = await Wallet.create({
      owner: payload.userId,
      ownerAccountType: payload.accountType,
    });

    return wallet;
  }

  async addWithdrawalDetails(
    ownerId: string,
    withdrawalDetails: IWithdrawalDetails
  ) {
    console.log({ ownerId });
    try {
      const wallet = await Wallet.findOne({ owner: ownerId }).select(
        "-__v -updatedAt -createdat"
      );

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      wallet.withdrawalDetails.push(withdrawalDetails);

      await wallet.save();

      return wallet;
    } catch (error: any) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, error.message);
    }
  }
}

export const walletRepo = new WalletRepository();

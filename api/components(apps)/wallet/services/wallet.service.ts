import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Wallet } from "../models/wallet.models";
import { IWalletDocument } from "../wallet.interface";

class WalletService {
  async getWalletBalanceByOwnerId(ownerId: string): Promise<IWalletDocument> {
    const wallet = await Wallet.findOne({ owner: ownerId })
      .select("balance")
      .lean()
      .exec();
    if (!wallet) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Wallet not found");
    }
    return wallet;
  }
}

export const walletService = new WalletService();

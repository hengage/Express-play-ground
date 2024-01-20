import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Wallet } from "../models/wallet.models";
import { IWalletDocument } from "../wallet.interface";

class WalletService {
  async getWalletByUserId(userId: string): Promise<IWalletDocument> {
    const wallet = await Wallet.findOne({ user: userId })
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

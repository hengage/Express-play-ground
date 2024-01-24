import { Earnings, Wallet } from "../models/wallet.models";
import { IRecordEarnings } from "../wallet.interface";

class WalletRepository {
  async create(payload: { userId: string; accountType: string }) {
    const wallet = await Wallet.create({
      owner: payload.userId,
      ownerAccountType: payload.accountType,
    });

    return wallet;
  }
}

export const walletRepo = new WalletRepository();

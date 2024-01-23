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

  async recordEarnings(payload: IRecordEarnings, session?: any) {
    if (session) {
      await Earnings.create([payload], { session });
    } else {
      await Earnings.create(payload);
    }
  }
}

export const walletRepo = new WalletRepository();

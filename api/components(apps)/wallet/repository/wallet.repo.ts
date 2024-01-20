import { Earnings, Wallet } from "../models/wallet.models";

class WalletRepository {
  async create(payload: { user: string; accountType: string }) {
    const wallet = await Wallet.create({
      user: payload.user,
      userAccountType: payload.accountType,
    });

    return wallet;
  }

  async recordEarnings(payload: any) {
    const earning = await Earnings.create({
      user: payload.userId,
      wallet: payload.walletId,
      amount: payload.amount,
      description: payload.description,
      reference: payload.reference,
    });

    console.log("Recorded earnings for user", earning)
  }
}

export const walletRepo = new WalletRepository();

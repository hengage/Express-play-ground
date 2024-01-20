import { Wallet } from "../models/wallet.models";

class WalletRepository {
  async create(payload: { user: string; accountType: string }) {
    const wallet = await Wallet.create({
      user: payload.user,
      userAccountType: payload.accountType,
    });

    return wallet;
  }
}

export const walletRepo = new WalletRepository();

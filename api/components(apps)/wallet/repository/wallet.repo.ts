import { Earnings, Wallet } from "../models/wallet.models";

class WalletRepository {
  async create(payload: { userId: string; accountType: string }) {
    const wallet = await Wallet.create({
      owner: payload.userId,
      ownerAccountType: payload.accountType,
    });

    return wallet;
  }

  async recordEarnings(payload: any, session?: any) {
    // const earning = await Earnings.create([{
    //   owner: payload.receiverId,
    //   paidBy: payload.customerId,
    //   amount: payload.amount,
    //   description: payload.description,
    //   reference: payload.reference,
    // }], {session});

    // console.log("Recorded earnings for user", earning)

    if (session) {
      await Earnings.create([payload], { session });
    } else {
      await Earnings.create(payload);
    }
  }
}

export const walletRepo = new WalletRepository();

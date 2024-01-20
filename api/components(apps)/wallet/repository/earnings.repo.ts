import { Earnings } from "../models/wallet.models";

class EarningsRepo {
  async recordEarning(payload: any) {
    const earning = await Earnings.create({
      user: payload.user,
      wallet: payload.wallet,
      amount: payload.amount,
      description: payload.description,
      reference: payload.reference,
    });

    return earning;
  }
}

export const earningsRepo =  new EarningsRepo()
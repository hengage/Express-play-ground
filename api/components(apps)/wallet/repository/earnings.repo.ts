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

  async getEarnings(userId: string, page: number) {
    const query = { owner: userId };

    const options = {
      page,
      limit: 14,
      lean: true,
      select: "user amount date description reference",
      leanWithId: false,
      sort: { date: -1 },
    };

    const earnings = await Earnings.paginate(query, options);
    return earnings;
  }
}

export const earningsRepo = new EarningsRepo();

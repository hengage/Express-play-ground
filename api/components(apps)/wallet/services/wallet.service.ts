import { startSession } from "mongoose";

import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Wallet } from "../models/wallet.models";
import { walletRepo } from "../repository/wallet.repo";
import { IWalletDocument } from "../wallet.interface";
import { earningsRepo } from "../repository/earnings.repo";

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

  async recordEarningsAndCreditWallet(payload: any) {
    const session = await startSession();

    try {
      session.startTransaction();

      await Wallet.creditWallet(payload.owner, payload.amount, session);
      await earningsRepo.recordEarnings(payload, session);

      await session.commitTransaction();
      console.log("Operation done");
    } catch (error: any) {
      await session.abortTransaction();
      // throw new HandleException(error.status, error.message);
      console.error({
        error: { status: error.status, message: error.message },
      });
    } finally {
      session.endSession();
    }
  }
}

export const walletService = new WalletService();

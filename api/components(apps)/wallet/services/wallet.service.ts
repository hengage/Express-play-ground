import { startSession } from "mongoose";

import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Wallet } from "../models/wallet.models";
import { walletRepo } from "../repository/wallet.repo";
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

  async recordEarningsAndCreditWallet(payload: any) {
    const session = await startSession();

    try {
      session.startTransaction();

      await walletRepo.recordEarnings(payload, session);
      await Wallet.creditWallet(payload.owner, payload.amount, session);

      await session.commitTransaction();
      console.log("Operation done")
    } catch (error: any) {
      await session.abortTransaction();
      throw new HandleException(error.status, error.message);
    } finally {
      session.endSession();
    }
  }
}

export const walletService = new WalletService();

import { startSession } from "mongoose";

import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Wallet } from "../models/wallet.models";
import { walletRepo } from "../repository/wallet.repo";
import { IWalletDocument } from "../wallet.interface";
import { earningsRepo } from "../repository/earnings.repo";
import { PAYSTACK_API_KEY } from "../../../config";
import axios from "axios";

class WalletService {
  private paystackAPIKey: string;
  private headers: Record<string, string>;
  constructor() {
    this.paystackAPIKey = `${PAYSTACK_API_KEY}`;
    this.headers = {
      Authorization: `Bearer ${this.paystackAPIKey}`,
    };
  }

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

  async createRecipient(user: string, payload: any) {
    try {
      const response = await axios.post(
        `https://api.paystack.co/transferrecipient/`,
        payload,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: any) {
      const errorResponse = error.response;
      throw new HandleException(errorResponse.status, errorResponse.data);
    }
  }
}

export const walletService = new WalletService();

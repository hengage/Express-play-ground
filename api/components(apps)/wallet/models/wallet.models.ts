import { Schema, model } from "mongoose";
import { IEarningsDocument, IWalletDocument } from "../wallet.interface";
import { HandleException, stringsUtils } from "../../../utils";
import {
  Currency,
  STATUS_CODES,
  WalletStatus,
  WithdrawalMethod,
} from "../../../constants";

const walletSchema = new Schema<IWalletDocument>(
  {
    _id: {
      type: String,
      default: () => stringsUtils.generateUniqueString(4),
    },
    user: { type: String, required: true },
    userAccountType: { type: String, required: true },
    balance: { type: String, default: "0" },
    transactionCount: { type: Number, default: 0 },
    totalEarnings: { type: String, default: "0" },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.GHANA_CEDIS,
    },
    withdrawalMethod: [
      {
        type: String,
        enum: Object.values(WithdrawalMethod),
      },
    ],
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const earningsSchema = new Schema<IEarningsDocument>(
  {
    _id: {
      type: String,
      default: stringsUtils.generateUniqueString(4),
    },
    user: { type: String, required: true },
    wallet: { type: String, required: true, ref: "Wallet" },
    amount: { type: String, required: true },
    reference: { type: String },
    date: { type: Date, required: true, default: Date.now() },
  },
  {
    timestamps: false,
  }
);

export const Wallet = model<IWalletDocument>("Wallet", walletSchema);
export const Earnings = model<IWalletDocument>("Earnings", earningsSchema);

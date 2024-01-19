import { Document } from "mongoose";
import {
  Currency,
  PaymentMethod,
  WIthdrawalFrequency,
  WalletStatus,
  WithdrawalRequestStatus,
} from "../../constants";

export interface IWalletDocument extends Document {
  _id: string;
  user: string;
  balance: string;
  transactionCount: number;
  totalEarnings: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  withdrawalFrequency: WIthdrawalFrequency;
  status: WalletStatus;
}

export interface IEarningsDocument extends Document {
  _id: string;
  user: string;
  wallet: IWalletDocument;
  amount: string;
  refernce: string;
  date: Date;
}

export interface TransactionDocument extends Document {
  _id: string;
  wallet: IWalletDocument;
  date: Date;
  amount: number;
  description: string;
  reference: string;
}

export interface WithdrawalRequestDocument extends Document {
  _id: string;
  user: string;
  wallet: string;
  status: WithdrawalRequestStatus;
  amount: number;
  date: Date;
}

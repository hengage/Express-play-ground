import { Document } from "mongoose";
import {
  Currency,
  WithdrawalMethod,
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
  withdrawalMethod: WithdrawalMethod;
  withdrawalFrequency: WIthdrawalFrequency;
  status: WalletStatus;
}

export interface IEarningsDocument extends Document {
  _id: string;
  user: string;
  wallet: IWalletDocument;
  amount: string;
  reference: string;
  date: Date;
}

export interface WithdrawalRequestDocument extends Document {
  _id: string;
  user: string;
  wallet: string;
  status: WithdrawalRequestStatus;
  amount: number;
  date: Date;
}

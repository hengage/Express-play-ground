import { TransactionDescription, TransactionType } from "../../constants";
import { IWalletDocument } from "../wallet";

export interface ITransactionDocument extends Document {
  _id: string;
  wallet: IWalletDocument;
  user: string;
  date: Date;
  type: TransactionType;
  status: string;
  amount: string;
  description: TransactionDescription;
  reference: string;
}
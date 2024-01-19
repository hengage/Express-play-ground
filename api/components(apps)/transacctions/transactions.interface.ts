import { TransactionDescription, TransactionType } from "../../constants";
import { IWalletDocument } from "../wallet";

export interface ITransactionDocument extends Document {
  _id: string;
  wallet: IWalletDocument;
  date: Date;
  type: TransactionType;
  amount: string;
  description: TransactionDescription;
  reference: string;
}

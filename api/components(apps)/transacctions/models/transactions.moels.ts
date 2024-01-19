import { PaginateModel, Schema, model } from "mongoose";
import { ITransactionDocument } from "../transactions.interface";
import { stringsUtils } from "../../../utils";
import { TransactionType } from "../../../constants";
import paginate from "mongoose-paginate-v2";

const transactionSchema = new Schema<ITransactionDocument>(
  {
    _id: {
      type: String,
      default: stringsUtils.generateUniqueString(4),
    },
    wallet: {
      type: String,
      required: true,
      ref: "Wallet",
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: String, required: true },
    reference: { type: String },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

transactionSchema.plugin(paginate);

export const Transaction = model<
  ITransactionDocument,
  PaginateModel<ITransactionDocument>
>("Transaction", transactionSchema);

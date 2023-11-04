import { Schema, model } from "mongoose";
import { IOrder } from "../orders.interface";
import { uniqueString } from "../../../utils";
import { OrderStatus } from "../../../constants";

const orderSchema = new Schema<IOrder>({
  _id: {
    type: String,
    required: true,
    default: () => uniqueString.generateUniqueString(4),
  },
  customer: { type: String, required: true, ref: "Customer" },
  items: [{
    product: {
        type: String,
        ref: 'Product', 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      shop: {
        type: String,
        required: true,
        ref: "Shop"
      },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  },
}, {_id: false, timestamps: true});


export const Order = model<IOrder>("Order", orderSchema);

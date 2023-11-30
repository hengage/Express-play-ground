import { Schema, model } from "mongoose";
import { IDeliveryRate, IOrder } from "../orders.interface";
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
  deliveryFee: {type: Number, required: true},
  deliveryAddress: {
    address: {type: String, required: true },
    latitude: {type: Number, required: true}, 
    longitude: {type: Number, required: true} 
  },
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


const deliveryRateSchema = new Schema<IDeliveryRate>({
  _id: {
    type: String,
    required: true,
    default: () => uniqueString.generateUniqueString(4),
  },
  baseFee: {type: Number, required: true},
  feePerKM: {type: Number, required: true},
  riderFeePerKM: {type: Number, required: true},
})


export const Order = model<IOrder>("Order", orderSchema);
export const DeliveryRate = model<IDeliveryRate>("DeliveryRate", deliveryRateSchema);
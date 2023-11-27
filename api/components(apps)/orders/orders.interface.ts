import { Document } from "mongoose";
import { OrderStatus } from "../../constants";

export interface IOrderItem {
  product: string;
  quantity: number;
  price: number;
  shop: string;
}

export interface IOrder extends Document {
  _id: string;
  customer: string;
  items: IOrderItem[];
  deliveryFee: number;
  deliveryAddress: {
    address: string;
    latitude: number;
    longitude: number;
  },
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

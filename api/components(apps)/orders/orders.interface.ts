import { Document } from "mongoose";
import { OrderStatus } from "../../constants";

export interface IOrderItem {
    product: string;
    quantity: number;
    price: number;
    shop: string 
  }
  
export interface IOrder extends Document {
    customer: string;
    items: IOrderItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
  }
import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  shop: string; 
  vendor: string; 
  sizes: string[]; 
  colors: string[]; 
}

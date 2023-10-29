import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  photos: string[];
  shop: string; 
  vendor: string; 
  sizes: string[]; 
  colors: string[]; 
}

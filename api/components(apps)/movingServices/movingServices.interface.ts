import { Document } from "mongoose";

export interface IMovingServiceCompany extends Document {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

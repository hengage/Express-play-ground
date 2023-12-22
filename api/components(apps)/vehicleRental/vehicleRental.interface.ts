import { Document } from "mongoose";


export interface IVehicleRentalVehicleType extends Document {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IVehicleRentalCompany extends Document {
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
  vehicles: Array<{
    vehicleType: IVehicleRentalVehicleType["_id"];
    regNumber: string;
    photos: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

import { Document } from "mongoose";

export interface ITowingVehicleType extends Document {
  _id: string;
  vehicleType: string;
  feePerKM: string;
  towingCompanyPercentage: string;
}

export interface ITowingCompany extends Document {
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
  // vehicleType: Array<ITowingVehicleType['_id']>;
  vehicleTypes: Array<{
    vehicleType: ITowingVehicleType["_id"];
    regNumber: string;
    photos: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITowingDriver extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  licenseNumber: string;
  photo: string;
  towingCompany: ITowingCompany["_id"];
}

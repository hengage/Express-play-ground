import { Document } from "mongoose";

export interface ITransportVehicleType extends Document {
  _id: string;
  vehicleType: string;
  serviceType: ITransportServiceType["_id"]
  feePerKM: string;
  transportCompanyPercentage: string;
}

export interface ITransportServiceType extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransportCompany extends Document {
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
  serviceType: ITransportServiceType["_id"]
  vehicles: Array<{
    vehicleType: ITransportVehicleType["_id"];
    regNumber: string;
    photos: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransportDriver extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  licenseNumber: string;
  photo: string;
  transportCompany: ITransportCompany["_id"];
}

import { Document } from "mongoose";
import { ICustomer } from "../customers";
import { IDriverRider } from "../driversAndRiders";

export interface IMessengerOrder extends Document {
  _id: string;
  customer: ICustomer["_id"];
  rider: IDriverRider["_id"];
  packageType: IPackageType["_id"];
  pickUpAddress: string;
  pickUpLocation: {
    type: string;
    coordinates: [number, number];
  };
  dropOffAddress: string;
  dropOffLocation: {
    type: string;
    coordinates: [number, number];
  };
  note: string;
  status: string;
  scheduledPickUpTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPackageType extends Document {
  _id: string;
  packageType: string;
  createdAt: string;
  updatedAt: string;
}

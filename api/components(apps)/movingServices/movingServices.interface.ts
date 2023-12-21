import { Document } from "mongoose";


export interface IMovingServiceVehicleType extends Document {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
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
//   vehicleType: Array<IMovingServiceVehicleType["_id"]>,
  vehicleTypes: IMovingServiceVehicleType["_id"][],
  createdAt: Date;
  updatedAt: Date;
}

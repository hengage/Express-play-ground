import { Document } from "mongoose";

export interface ITowingVehicleType extends Document{
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
    },
    vehicleType: Array<ITowingVehicleType['_id']>;
    createdAt: Date;
    updatedAt: Date;

}
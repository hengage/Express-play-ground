import { Document } from "mongoose";

export interface IVehicleType extends Document {
    _id: string;
    vehicleType: string;
    baseFee: string;
    feePerKM: string
    riderPercentage: string
}
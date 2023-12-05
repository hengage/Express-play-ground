import { Document } from "mongoose";

export interface IVehicleType extends Document {
    _id: string;
    vehicleType: string;
    baseFee: string;
    feePerKM: string
    riderPercentage: string
}

export interface ITrip extends Document {
    _id: string;
    customer: string;
    driver: string;
    pickupLocation: {
        locationType: string;
        coordinates: [number, number];
    };
    destination: {
        locationType: string;
        coordinates: [number, number];
    };
    vehicleType: string;
    price: string;
    status: string;
    date: string;

}
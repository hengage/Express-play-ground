import { Document } from "mongoose"

export interface ILandlordDocument extends Document {
    _id: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    address: string,
}

export interface IPropertyDocument extends Document {
    _id: string,
    landlord: ILandlordDocument["_id"],
    description: string,
    numberOfBedrooms: number,
    numberOfBathrooms: number,
    pets: "yes" | "no" 
    furnished: "yes" | "no"
    photos: Array<string>
    rentPerMonth: string
    address: string
    location: {
        type: string,
        coordinates: [number, number]
    }
}
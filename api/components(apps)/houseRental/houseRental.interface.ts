import { Document } from "mongoose"

export interface ILandlordDocument extends Document {
    _id: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    address: string,
}
import { Schema, model } from "mongoose";
import { uniqueString } from "../../../utils";
import { ITowingDriver } from "../towing.interface";

const towingDriverSchema = new Schema<ITowingDriver>({
  _id: {
    type: String,
    required: true,
    default: () => uniqueString.generateUniqueString(4),
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    type: String,
    required: true,
  },
  towingCompany: {
    type: String,
    required: true,
  }
});

export const TowingDriver = model<ITowingDriver>(
  "towingdriver",
  towingDriverSchema
);

import { Schema, model } from "mongoose";
import { stringsUtils } from "../../../utils";
import { ITowingDriver } from "../towing.interface";

const towingDriverSchema = new Schema<ITowingDriver>({
  _id: {
    type: String,
    required: true,
    default: () => stringsUtils.generateUniqueString(4),
  },
  firstName: {
    type: String,
    required: true,
    set: stringsUtils.toLowerCaseSetter
  },
  lastName: {
    type: String,
    required: true,
    set: stringsUtils.toLowerCaseSetter
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

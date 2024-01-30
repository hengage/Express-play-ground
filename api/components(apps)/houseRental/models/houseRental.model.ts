import { Schema, model } from "mongoose";
import { stringsUtils } from "../../../utils";
import { ILandlordDocument } from "../houseRental.interface";

const landlordSchema = new Schema<ILandlordDocument>(
  {
    _id: {
      type: String,
      default: stringsUtils.generateUniqueString(4),
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, default: null, unique: true },
    address: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const Landlord = model("Lanldord", landlordSchema);

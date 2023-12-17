import { Schema, model } from "mongoose";
import { uniqueString } from "../../../utils";
import { ITowingCompany, ITowingVehicleType } from "../towing.interface";

const towingVehicleTypeSchema = new Schema<ITowingVehicleType>({
  _id: {
    type: String,
    required: true,
    default: () => uniqueString.generateUniqueString(4),
  },
  vehicleType: { type: String, required: true, unique: true },
  feePerKM: { type: String, required: true },
  towingCompanyPercentage: { type: String, required: true },
});

const towingCompany = new Schema<ITowingCompany>(
  {
    _id: {
      type: String,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number, Number], required: true },
    },
    vehicleType: {
      type: [String],
      ref: "TowingVehicleType",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const TowingVehicleType = model<ITowingVehicleType>(
  "towingVehicleType",
  towingVehicleTypeSchema
);
export const TowingCompany = model<ITowingCompany>(
  "towingCompany",
  towingCompany
);

import { Schema, model } from "mongoose";
import { encryption, uniqueString } from "../../../utils";
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

const towingCompanySchema = new Schema<ITowingCompany>(
  {
    _id: {
      type: String,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number, Number], required: true },
    },
    vehicles: [
      {
        vehicleType: { type: String, required: true, ref: "TowingVehicleType" },
        regNumber: { type: String, required: true },
        photos: [{ type: String, required: true}]
      },
    ],
  },
  {
    timestamps: true,
  }
);

towingCompanySchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await encryption.encryptValue(this.password);
    } catch (error: any) {
      return next(error);
    }
  }
});

export const TowingVehicleType = model<ITowingVehicleType>(
  "towingVehicleType",
  towingVehicleTypeSchema
);
export const TowingCompany = model<ITowingCompany>(
  "towingCompany",
  towingCompanySchema
);

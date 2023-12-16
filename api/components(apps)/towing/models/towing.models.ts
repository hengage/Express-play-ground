import { Schema, model } from "mongoose";
import { uniqueString } from "../../../utils";
import { ITowingVehicleType } from "../towing.interface";

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

export const TowingVehicleType = model<ITowingVehicleType>(
  "towingVehicleType",
  towingVehicleTypeSchema
);

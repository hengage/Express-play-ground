import { model, Schema } from "mongoose";
import { ITrip, IVehicleType } from "../maku.interfaces";
import { uniqueString } from "../../../utils";

const vehicleTypeSchema = new Schema<IVehicleType>({
  _id: {
    type: String,
    required: true,
    default: () => uniqueString.generateUniqueString(4),
  },
  vehicleType: { type: String, required: true },
  baseFee: { type: String, required: true },
  feePerKM: { type: String, required: true },
  riderPercentage: { type: String, required: true },
});

const tripSchema = new Schema<ITrip>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    customer: { type: String, required: true, ref: "Customer" },
    driver: { type: String, required: true, ref: "DriverRider" },
    pickupLocation: {
      locationType: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    destination: {
      locationType: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    vehicleType: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: String, default: "" },
  },
  { timestamps: true, _id: false }
);

export const Trip = model<ITrip>("Trip", tripSchema);

export const VehicleType = model<IVehicleType>(
  "VehicleType",
  vehicleTypeSchema
);

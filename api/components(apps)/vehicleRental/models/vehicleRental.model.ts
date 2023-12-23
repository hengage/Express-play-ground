import { Schema, model } from "mongoose";
import { encryption, stringsUtils } from "../../../utils";
import { IVehicleRentalCompany, IVehicleRentalVehicleType } from "../vehicleRental.interface";

const vehicleRentalVehicleTypeSchema = new Schema<IVehicleRentalVehicleType>(
  {
    _id: {
      type: String,
      required: true,
      default: () => stringsUtils.generateUniqueString(4),
    },
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true, _id: false }
);

const vehicleRentalSchema = new Schema<IVehicleRentalCompany>(
  {
    _id: {
      type: String,
      unique: true,
      default: () => stringsUtils.generateUniqueString(4),
    },
    name: {
      type: String,
      required: true,
      unique: true,
      set: stringsUtils.toLowerCaseSetter
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      set: stringsUtils.toLowerCaseSetter
    },
    password: {
      type: String,
      reuqired: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number, Number],
        required: true,
      },
    },
    vehicles: [
      {
        vehicleType: {
          type: String,
          required: true,
          ref: "MovingServiceVehicleType",
        },
        regNumber: { type: String, required: true },
        photos: [{ type: String, required: true }],
      },
    ],
  },
  {
    timestamps: true,
    _id: false,
  }
);

vehicleRentalSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await encryption.encryptValue(this.password);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const VehicleRentalCompany = model<IVehicleRentalCompany>(
  "vehicleRental",
  vehicleRentalSchema
);

export const VehicleRentalVehicleType = model<IVehicleRentalVehicleType>(
  "vehicleRentalVehicleType",
  vehicleRentalVehicleTypeSchema
);

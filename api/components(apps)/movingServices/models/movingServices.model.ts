import { Schema, model } from "mongoose";
import { encryption, stringsUtils } from "../../../utils";
import {
  IMovingServiceCompany,
  IMovingServiceVehicleType,
} from "../movingServices.interface";

const movingServicesVehicleTypeSchema = new Schema<IMovingServiceVehicleType>(
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

const movingServiceCompanySchema = new Schema<IMovingServiceCompany>(
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

movingServiceCompanySchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await encryption.encryptValue(this.password);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const MovingServiceCompany = model<IMovingServiceCompany>(
  "movingService",
  movingServiceCompanySchema
);

export const MovingServiceVehicleType = model<IMovingServiceVehicleType>(
  "movingServiceVehicleType",
  movingServicesVehicleTypeSchema
);

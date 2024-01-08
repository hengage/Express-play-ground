import { Schema, model } from "mongoose";
import { encryption, stringsUtils } from "../../../utils";
import {
  ITransportCompany,
  ITransportVehicleType,
  ITransportServiceType,
} from "../transport.interface";

const transportVehicleTypeSchema = new Schema<ITransportVehicleType>(
  {
    _id: {
      type: String,
      required: true,
      default: () => stringsUtils.generateUniqueString(4),
    },
    vehicleType: { type: String, required: true, unique: true },
    serviceType: {
      type: String,
      required: true,
      unique: true,
      ref: "TransportServiceType",
    },
    photo: { type: String, required: true,},
    feePerKM: { type: String, },
    transportCompanyPercentage: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const transportServiceTypeSchema = new Schema<ITransportServiceType>(
  {
    _id: {
      type: String,
      required: true,
      default: () => stringsUtils.generateUniqueString(4),
    },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const transportCompanySchema = new Schema<ITransportCompany>(
  {
    _id: {
      type: String,
      default: () => stringsUtils.generateUniqueString(4),
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
    serviceType: { type: String, required: true, ref: "TransportServiceType" },
    vehicles: [
      {
        vehicleType: {
          type: String,
          required: true,
          ref: "TransportVehicleType",
        },
        regNumber: { type: String, required: true },
        photos: [{ type: String, required: true }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

transportCompanySchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await encryption.encryptValue(this.password);
    } catch (error: any) {
      return next(error);
    }
  }
});

export const TransportServiceType = model<ITransportServiceType>(
  "TransportServiceType",
  transportServiceTypeSchema
);

export const TransportVehicleType = model<ITransportVehicleType>(
  "TransportVehicleType",
  transportVehicleTypeSchema
);
export const TransportCompany = model<ITransportCompany>(
  "TransportCompany",
  transportCompanySchema
);

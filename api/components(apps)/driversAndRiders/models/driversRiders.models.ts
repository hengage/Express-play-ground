import { Schema, model } from "mongoose";
import { IDriverRider } from "../driversRiders.interface";
import { encryption, uniqueString } from "../../../utils";
import { AccountStatus, DriverRiderType } from "../../../constants";

const driverRiderSchema = new Schema<IDriverRider>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: String,
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: String,
    licenseNumber: { type: String, required: true },
    vehicleType: { type: String, ref: "VehicleType", required: true },
    vehicleInsurancePhoto: { type: String, required: true },
    govtIdPhoto: { type: [String, String], required: true },
    accountType: {
      type: String,
      required: true,
      enum: DriverRiderType,
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    rating: {
      totalRatingSum: {
        type: Number,
        default: 0,
      },
      ratingCount: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
      },
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: {type: [Number, Number], default: [0, 0]} 
    },
    lastLoggedIn: { type: Date },
    approved: { type: Boolean, default: false },
    available: { type: Boolean, default: false },
  },
  { timestamps: true, _id: false }
);

driverRiderSchema.index({ location: "2dsphere" });

driverRiderSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await encryption.encryptValue(this.password);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const DriverRider = model<IDriverRider>(
  "DriverRider",
  driverRiderSchema
);

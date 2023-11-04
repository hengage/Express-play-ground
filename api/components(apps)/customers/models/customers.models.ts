import { Schema, model } from "mongoose";
import { ICustomer } from "../customers.interface";
import { AccountStatus, Gender } from "../../../constants";
import { encryption, uniqueString } from "../../../utils";

const customerSchema = new Schema<ICustomer>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: String,
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    geolocation: {
      latitude: Number,
      longitude: Number,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    profilePhoto: String,
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    lastLoggedIn: Date,
  },
  { timestamps: true, _id: false }
);

customerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await encryption.encryptValue(this.password);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const Customer = model<ICustomer>("Customer", customerSchema);

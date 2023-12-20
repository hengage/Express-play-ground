import { Schema, model } from "mongoose";
import { uniqueString } from "../../../utils";
import { IMovingServiceCompany } from "../movingServices.interface";

const movingServiceCompanySchema = new Schema<IMovingServiceCompany>(
  {
    _id: {
      type: String,
      unique: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: {
      type: String,
      required: true,
      unique: true
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
  },
  {
    timestamps: true, _id: false
  }
);

export const MovingServiceCompany = model<IMovingServiceCompany>(
  "movingService",
  movingServiceCompanySchema
);

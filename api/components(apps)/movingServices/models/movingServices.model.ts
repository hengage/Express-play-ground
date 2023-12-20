import { Schema, model } from "mongoose";
import { uniqueString } from "../../../utils";
import { IMovingServiceCompany } from "../movingServices.interface";

const movingSrviceCompanySchema = new Schema<IMovingServiceCompany>(
  {
    _id: {
      type: String,
      unique: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: {
      type: String,
      required: true,
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
      },
    },
  },
  {
    timestamps: true,
  }
);

export const movingSrviceCompany = model<IMovingServiceCompany>(
  "movingService",
  movingSrviceCompanySchema
);

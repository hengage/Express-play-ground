import { Schema, model } from "mongoose";
import { encryption, uniqueString } from "../../../utils";
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

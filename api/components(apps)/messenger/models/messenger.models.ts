import { Schema, model } from "mongoose";
import { stringsUtils } from "../../../utils";
import { IMessengerOrder, IPackageType } from "../messenger.interface";

const messengerOrderShema = new Schema<IMessengerOrder>(
  {
    _id: {
      type: String,
      default: () => stringsUtils.generateUniqueString(4),
    },
    customer: {
      type: String,
      required: true,
      ref: "Customer",
    },
    rider: {
      type: String,
      ref: "DriverRider",
    },
    packageType: {
      type: String,
      ref: "PackageType",
    },
    pickUpAddress: {
      type: String,
      required: true,
    },
    pickUpLocation: {
      type: {
        type: String,
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    dropOffAddress: {
      type: String,
      required: true,
    },
    dropOffLocation: {
      type: {
        type: String,
        defaul: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    note: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    scheduledPickUpTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const packageTypeSchema = new Schema<IPackageType>(
  {
    _id: {
      type: String,
      default: () => stringsUtils.generateUniqueString(4),
    },
    packageType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PackageType = model<IPackageType>("packageType", packageTypeSchema);
export const MessengerOrder = model<IMessengerOrder>(
  "messengerOrder",
  messengerOrderShema
);
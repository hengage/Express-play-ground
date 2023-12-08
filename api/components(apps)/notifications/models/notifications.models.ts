import { model, Schema } from "mongoose";
import { INotification } from "../notifications.interface";

const notificationSchema = new Schema(
  {
    user: {
      type: String,
      ref: "Customer" || "Vendor" || "DriverRider",
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, default: null },
    data: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notifications = model<INotification>(
  "notification",
  notificationSchema
);

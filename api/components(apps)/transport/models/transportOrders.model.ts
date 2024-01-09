import mongoose, { Schema, model } from "mongoose";
import { stringsUtils } from "../../../utils";
import { ITowingOrder, ITransportTripOrder } from "../transport.interface";
import { TransportServiceOrderStatus } from "../../../constants";
import paginate from "mongoose-paginate-v2";

const towOrderSchema = new Schema<ITowingOrder>(
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
    transportCompany: {
      type: String,
      required: true,
      ref: "TransportCompany",
    },
    vehicleType: {
      type: String,
      required: true,
      ref: "TransportVehicleType",
    },
    pickUpAddress: {
      type: String,
      required: true,
    },
    pickUpCoordinates: {
      type: { type: String, default: "Point" },
      coordinates: [Number, Number],
    },
    destinationAddress: {
      type: String,
      required: true,
    },
    destinationCoordinates: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number, Number], required: true },
    },
    status: {
      type: String,
      default: TransportServiceOrderStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const transportTripOrderSchema = new Schema<ITransportTripOrder>(
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
    transportCompany: {
      type: String,
      required: true,
      ref: "TransportCompany",
    },
    serviceType: {
      type: String,
      required: true,
      ref: "TransportServiceType",
    },
    vehicleType: {
      type: String,
      required: true,
      ref: "TransportVehicleType",
    },
    pickUpAddress: { type: String, default: null },
    pickUpCoordinates: {
      type: { type: String, default: "Point" },
      coordinates: [Number, Number],
    },
    destinationAddress: { type: String, default: null },
    destinationCoordinates: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number, Number], required: true },
    },
    status: {
      type: String,
      default: TransportServiceOrderStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

transportTripOrderSchema.plugin(paginate);

export const TowOrder = model<ITowingOrder>("towOrder", towOrderSchema);

export const TransportTripOrder = model<
  ITransportTripOrder,
  mongoose.PaginateModel<ITransportTripOrder>
>("transportTripOrder", transportTripOrderSchema);

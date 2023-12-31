import { Schema, model } from "mongoose";
import { stringsUtils } from "../../../utils";
import { ITowingOrder, ITransportTripOrder } from "../transport.interface";

const towingOrderSchema = new Schema<ITowingOrder>(
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
  },
  {
    timestamps: true,
  }
);

export const TowingOrder = model<ITowingOrder>(
  "towingOrder",
  towingOrderSchema
);

export const TransportTripOrder = model<ITransportTripOrder>(
  "transportTripOrder",
  transportTripOrderSchema
);

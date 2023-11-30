import { model, Schema } from "mongoose";
import { IVehicleType } from "../maku.interfaces";
import { uniqueString } from "../../../utils";

const vehicleTypeSchema = new Schema<IVehicleType>({
    _id: {
        type: String,
        required: true,
        default: () => uniqueString.generateUniqueString(4),
    },
    vehicleType: {type: String, required: true},
    baseFee: {type: String, required: true, },
    feePerKM: {type: String, required: true},
    riderPercentage: {type: String, required: true }
})

export const VehicleType = model<IVehicleType>('VehicleType', vehicleTypeSchema)
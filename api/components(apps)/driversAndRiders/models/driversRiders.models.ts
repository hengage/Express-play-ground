import { Schema, model } from "mongoose";
import { IDriverRider } from "./driversRiders.models.interface";
import { encryption, uniqueString } from "../../../utils";
import { AccountStatus } from "../../../constants";

const driverRiderSchema = new Schema<IDriverRider>({
  _id: {
    type: String,
    required: true,
    default: () => uniqueString.generateUniqueString(4),
  },
  name: {
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lasttName: { type: String, required: true },
  },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  licenseNumber: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleInsurancePhoto: { type: String, required: true },
  govtIdPhoto: { type: String, required: true },
  accountStatus: {
    type: String,
    enum: Object.values(AccountStatus),
    default: AccountStatus.Active,
  },
  rating: { type: Number, required: true },
  lastLoggedIn: { type: Date },
  approved: { type: Boolean, default: false },
});

driverRiderSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await encryption.encryptValue(this.password);
      
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const driverRider = model<IDriverRider>("Customer", driverRiderSchema);
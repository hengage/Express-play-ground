import { AccountStatus, DriverRiderType } from "../../../constants";

export interface IDriverRider extends Document {
_id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
  email: string;
  phoneNumber: string;
  password: string;
  type: DriverRiderType;
  vehicleType: string;
  vehicleInsurancePhoto: string;
  licenseNumber: string;
  govtIdPhoto: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  accountStatus: AccountStatus;
  rating: number;
  approved: boolean;
  lastLoggedIn: Date;
  createdAt: Date;
  updatedAt: Date;
}

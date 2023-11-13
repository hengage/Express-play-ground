import { AccountStatus, DriverRiderType } from "../../constants";

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
  photo: string;
  accountType: DriverRiderType;
  vehicleType: string;
  vehicleInsurancePhoto: string;
  licenseNumber: string;
  govtIdPhoto: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  accountStatus: AccountStatus;
  rating: {
    totalRatingSum: number,
    ratingCount: number;
    averageRating: number;
  };
  approved: boolean;
  lastLoggedIn: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignupDriverAndRider {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  password: string;
  photo: string;
  vehicleType: string;
  vehicleInsurancePhoto: string;
  licenseNumber: string;
  govtIdPhoto: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ILoginDriverAndRider {
  phoneNumber: string;
  password: string;
}

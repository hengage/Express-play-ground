import { AccountStatus,  } from "../../../constants";

export interface IShop extends Document {
_id: string;
  name: string
  email: string;
  phoneNumber: string;
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  geoLocation: {
    latitiude: number;
    longitiude: number;
  }
  logo: string;
  status: AccountStatus;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
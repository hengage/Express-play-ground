import { AccountStatus } from "../../../constants";
import { IVendor } from "../../vendors";

export interface IShop extends Document {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  vendor: IVendor;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  geoLocation: {
    latitiude: number;
    longitiude: number;
  };
  category: string;
  logo: string;
  status: AccountStatus;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  _id: string;
  name: string;
  description: string;
  image: string;
}

export interface IAddCategory {
  name: string;
  image: string;
}

export interface ICreateShop {
  name: string;
  email: string;
  phoneNumber: string;
  vendor: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  category: string;
  logo: string;
}

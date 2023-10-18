import { Schema } from "mongoose";
import { AccountStatus, ShopCategory,  } from "../../../constants";
import { IVendor } from "../../vendors";

export interface IShop extends Document {
_id: string;
  name: string
  email: string;
  phoneNumber: string;
  password: string;
  vendor: IVendor;
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
  categories: ShopCategory
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
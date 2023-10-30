import { AccountStatus,  } from "../../constants";

export interface IVendor extends Document {
_id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
  email: string;
  phoneNumber: string;
  photo: string;
  password: string;
  govtIdPhoto: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  businessname: string;
  profilephoto: string;
  accountStatus: AccountStatus;
//   approved: boolean;
  lastLoggedIn: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignupVendor {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  photo: string;
  email: string;
  govtIdPhoto: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  
}
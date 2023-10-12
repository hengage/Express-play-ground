import { AccountStatus,  } from "../../../constants";

export interface IVendor extends Document {
_id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
  email: string;
  phoneNumber: string;
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
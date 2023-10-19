export interface ICustomer extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  country: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  geolocation: {
    longitude: number;
    latitude: number;
  };
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  profilePhoto: string;
  accountStatus: string;
  lastLoggedIn: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignupCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ILoginCustomer {
  phoneNumber: string;
  password: string;
}

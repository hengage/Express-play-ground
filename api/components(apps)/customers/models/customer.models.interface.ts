export interface ICustomer extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
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
    gender: 'Male' | 'Female' | 'Other';
    profilePhoto: string;
    accountStatus: string;
    lastLoginDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  
  
  
  
  
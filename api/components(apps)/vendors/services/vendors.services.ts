import { HandleException } from "../../../utils";
import { Vendor } from "../models/vendors.model";

class VendorService {
    async signup(payload: any) {
        let middleName;
        if (payload.middleName) {
          middleName = payload.middleName;
        } else {
          middleName = null;
        }
        try {
          const newVendor = new Vendor({
            name: {
              firstName: payload.firstName,
              lastName: payload.lastName,
              middleName,
            },
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            password: payload.password,
            govtIdPhoto: payload.govtIdPhoto,
            address: {
              street: payload.street,
              city: payload.city,
              state: payload.state,
              country: payload.country,
              zipCode: payload.zipCode,
            },
          });
          const savedDriverrider = newVendor.save();
          return savedDriverrider;
        } catch (error: any) {
          throw new HandleException(500, error.message);
        }
      }
}

export const vendorService = new VendorService();
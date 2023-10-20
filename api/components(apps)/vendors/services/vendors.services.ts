import bcrypt from "bcrypt";

import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Vendor } from "../models/vendors.model";
import { IVendor } from "../vendors.interface";

class VendorService {
  async getVendorByPhoneNumber(
    phoneNumber: string,
    selectFields?: string
  ): Promise<IVendor> {
    try {
      const query = Vendor.findOne({
        phoneNumber: { $eq: phoneNumber },
      });

      if (selectFields) {
        query.select(selectFields);
      }

      const customer = await query.exec();
      if (!customer) {
        throw new HandleException(404, "Vendor not found");
      }
      return customer;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }


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
          const savedVendor = await newVendor.save();
          return savedVendor;
        } catch (error: any) {
          throw new HandleException(STATUS_CODES.SERVER_ERROR, error.message);
        }
      }

      async login(payload: any): Promise<any> {
        try {
          const vendor = await this.getVendorByPhoneNumber(
            payload.phoneNumber,
            "phoneNumber password"
          );
    
          const passwordsMatch = await bcrypt.compare(
            payload.password,
            vendor.password
          );
          if (!passwordsMatch) {
            throw new HandleException(STATUS_CODES.UNAUTHORIZED, "Incorrect password");
          }
          const loggedInVendor = {
            _id: vendor._id,
            phoneNumber: vendor.phoneNumber,
          };
    
          return loggedInVendor;
        } catch (error: any) {
          throw new HandleException(error.status, error.message);
        }
      }
}

export const vendorService = new VendorService();
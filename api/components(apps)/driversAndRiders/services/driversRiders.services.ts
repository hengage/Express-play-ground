import bcrypt from "bcrypt";

import { HandleException } from "../../../utils";
import { DriverRider } from "../models/driversRiders.models";
import { IDriverRider } from "../models/driversRiders.models.interface";
import { STATUS_CODES } from "../../../constants";

class DriverRiderService {
  async getDriverOrRiderByPhoneNumber(
    phoneNumber: string,
    selectFields?: string
  ): Promise<IDriverRider> {
    try {
      const query = DriverRider.findOne({
        phoneNumber: { $eq: phoneNumber },
      });

      if (selectFields) {
        query.select(selectFields);
      }

      const driverRider = await query.exec();
      if (!driverRider) {
        throw new HandleException(404, "Driver or rider not found");
      }
      return driverRider;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getDriverOrRiderById(
    _id: string,
    selectFields?: string
  ): Promise<IDriverRider> {
    try {
      const query = DriverRider.findById(_id);

      if (selectFields) {
        query.select(selectFields);
      }

      const driverRider = await query.exec();
      if (!driverRider) {
        throw new HandleException(404, "Driver or rider not found");
      }
      return driverRider;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async signup(payload: any, accountType: string) {
    let middleName;
    if (payload.middleName) {
      middleName = payload.middleName;
    } else {
      middleName = null;
    }
    try {
      const newDriverRider = new DriverRider({
        name: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          middleName,
        },
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: payload.password,
        accountType,
        vehicleType: payload.vehicleType,
        vehicleInsurancePhoto: payload.vehicleInsurancePhoto,
        licenseNumber: payload.licenseNumber,
        govtIdPhoto: payload.govtIdPhoto,
        address: {
          street: payload.street,
          city: payload.city,
          state: payload.state,
          country: payload.country,
          zipCode: payload.zipCode,
        },
      });
      const savedDriverrider = newDriverRider.save();
      return savedDriverrider;
    } catch (error: any) {
      throw new HandleException(500, error.message);
    }
  }

  async login(payload: any) {
    try {
      const driverRider = await this.getDriverOrRiderByPhoneNumber(
        payload.phoneNumber,
        "phoneNumber password"
      );

      const passwordsMatch = await bcrypt.compare(
        payload.password,
        driverRider.password
      );
      if (!passwordsMatch) {
        throw new HandleException(STATUS_CODES.UNAUTHORIZED, "Incorrect password");
      }

      const loggedIn = {
        _id: driverRider._id,
        phoneNumber: driverRider.phoneNumber,
      };
      return loggedIn;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const driverRiderService = new DriverRiderService();

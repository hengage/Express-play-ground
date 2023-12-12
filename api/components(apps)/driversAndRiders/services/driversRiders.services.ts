import bcrypt from "bcrypt";

import { HandleException } from "../../../utils";
import { DriverRider } from "../models/driversRiders.models";
import {
  IDriverRider,
  ILoginDriverAndRider,
  ISignupDriverAndRider,
} from "../driversRiders.interface";
import { STATUS_CODES } from "../../../constants";
import { driverRiderRepo } from "../repository/driverRider.repo";

class DriverRiderService {
  public async signup(payload: ISignupDriverAndRider, accountType: string) {
    let middleName;
    if (payload.middleName) {
      middleName = payload.middleName;
    } else {
      middleName = null;
    }
    try {
      const newDriverRider = new DriverRider({
        firstName: payload.firstName,
        lastName: payload.lastName,
        middleName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: payload.password,
        photo: payload.photo,
        accountType,
        vehicleType: payload.vehicleType,
        vehicleInsurancePhoto: payload.vehicleInsurancePhoto,
        licenseNumber: payload.licenseNumber,
        govtIdPhoto: payload.govtIdPhoto,
        street: payload.street,
        city: payload.city,
        state: payload.state,
        country: payload.country,
        postalCode: payload.postalCode,
      });
      const savedDriverrider = newDriverRider.save();
      return savedDriverrider;
    } catch (error: any) {
      throw new HandleException(500, error.message);
    }
  }

  async login(payload: ILoginDriverAndRider) {
    try {
      const driverRider = await driverRiderRepo.getByPhoneNumber(
        payload.phoneNumber,
        "phoneNumber password"
      );

      const passwordsMatch = await bcrypt.compare(
        payload.password,
        driverRider.password
      );
      if (!passwordsMatch) {
        throw new HandleException(
          STATUS_CODES.UNAUTHORIZED,
          "Incorrect password"
        );
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

  async rateDriverOrRider(id: string, rating: number, accountType: string) {
    try {
      const driverRider = await DriverRider.findOne({
        _id: id,
        accountType,
      }).select("rating");

      if (!driverRider) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          `${accountType} not found`
        );
      }

      // Increase the number of times the account has been rated
      driverRider.rating.ratingCount += 1;

      // Add the new rating to the sum of the previous ratings
      driverRider.rating.totalRatingSum += rating;

      // Calculate the average rating
      driverRider.rating.averageRating =
        driverRider.rating.totalRatingSum / driverRider.rating.ratingCount;

      await driverRider.save();
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async setDriverAvailable(id: string) {
    const driverRider = await DriverRider.findById(id).select("available");
    if (driverRider) {
      driverRider.available = true;
      await driverRider.save();
    }
  }

  async setDriverUnavailable(id: string | null) {
    const driverRider = await DriverRider.findById(id).select("available");
    if (driverRider) {
      driverRider.available = false;
      await driverRider.save();
    }
  }
}

export const driverRiderService = new DriverRiderService();

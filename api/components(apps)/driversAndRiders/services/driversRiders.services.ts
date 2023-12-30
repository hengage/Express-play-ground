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
import { MakuTrip } from "../../maku";

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

  async login(payload: ILoginDriverAndRider, accountType: string) {
    try {
      if (!accountType) {
        throw new HandleException(
          STATUS_CODES.BAD_REQUEST,
          "Account type not specified"
        );
      }

      const driverRider = await DriverRider.findOne({
        phoneNumber: payload.phoneNumber,
        accountType,
      }).select("phoneNumber password accountType");

      if (!driverRider) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          `${accountType} not found`
        );
      }

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

      return {
        _id: driverRider._id,
        phoneNumber: driverRider.phoneNumber,
      };
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async getMe(id: string) {
    try {
      const driverRider = await driverRiderRepo.getById(
        id,
        `firstName lastName middleName email phoneNumber 
        vehicleType licenseNumber rating street city state`
      );

      if (driverRider) {
        return driverRider;
      }

      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Driver/rider Not found"
      );
    } catch (error: any) {
      throw new HandleException(error.staus, error.message);
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

  async setAvailablity(id: string | null, availability: boolean) {
    const driverRider = await DriverRider.findById(id).select("available");
    if (driverRider) {
      driverRider.available = availability;
      await driverRider.save();
    }
  }

  public async updateLocation(id: string, coordinates: [number, number]) {
    const driver = await DriverRider.findById(id).select("location");

    if (!driver) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Cannot find driver");
    }
    driver.location.coordinates = coordinates;
    await driver.save();
  }

  async makuTripHistory(driverId: string, page: number) {
    const query = { driver: driverId };
    const options = {
      page,
      limit: 10,
      select: "_id pickUpAddress destinationAddress price status createdAt",
      populate: [
        {
          path: "customer",
          select: "firstName lastName phoneNumber profilePhoto",
        },
      ],
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const trips = MakuTrip.paginate(query, options);

    return trips;
  }
}

export const driverRiderService = new DriverRiderService();

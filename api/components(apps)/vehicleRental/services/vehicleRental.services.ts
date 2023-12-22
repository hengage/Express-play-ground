import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
import {VehicleRentalCompany } from "../models/vehicleRental.model"

class VehicleRentalService {
  async signup(payload: any) {
    const vehicleRental = await new VehicleRentalCompany({
      name: payload.name,
      address: payload.address,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      password: payload.password,
      location: {
        coordinates: payload.coordinates,
      },
    }).save();

    return {
      _id: vehicleRental._id,
      phoneNumber: vehicleRental.phoneNumber,
    };
  }

  async login(payload: any) {
    const msc = await VehicleRentalCompany.findOne({
      phoneNumber: payload.phoneNumber,
    })
      .select("phoneNumber password")
      .lean()
      .exec();

    if (!msc) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Business not found");
    }

    const password = await encryption.compareValues(
      payload.password,
      msc.password
    );

    if (!password) {
      throw new HandleException(
        STATUS_CODES.UNAUTHORIZED,
        "Incorrect password"
      );
    }

    return {
      _id: msc._id,
      phoneNumber: msc.phoneNumber,
    };
  }

  async addVehicle(payload: any, movingServiceId: string) {
    const { vehicle } = payload;
    const vehicleRental = await VehicleRentalCompany.findById(
      movingServiceId
    ).select("vehicles");

    if (!vehicleRental) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "The business does not exist"
      );
    }

    if (
        vehicleRental.vehicles.some((vt) => vt.regNumber === vehicle.regNumber)
    ) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "A vehicle with the same registration number already exists for this business"
      );
    }

    vehicleRental.vehicles.push(payload.vehicle);
    await vehicleRental.save();
  }
}

export const vehicleRentalService = new VehicleRentalService();

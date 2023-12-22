import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
import { TowingCompany } from "../models/towing.models";
import { TowingDriver } from "../models/towingDriver.model";

class TowingService {
  async create(payload: any) {
    const towingCompany = await new TowingCompany({
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      password: payload.password,
      address: payload.address,
      location: {
        coordinates: payload.coordinates,
      },
    }).save();

    return {
      _id: towingCompany._id,
      name: towingCompany.name,
    };
  }

  async login(payload: any) {
    const towingCompany = await TowingCompany.findOne({
      phoneNumber: payload.phoneNumber,
    })
      .select("phoneNumber password")
      .lean()
      .exec();

    if (!towingCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Company account not found"
      );
    }

    const password = await encryption.compareValues(
      payload.password,
      towingCompany.password
    );
    if (!password) {
      throw new HandleException(
        STATUS_CODES.UNAUTHORIZED,
        "Incorrect password"
      );
    }

    return {
      _id: towingCompany._id,
      phoneNumber: towingCompany.phoneNumber,
    };
  }

  async addVehicle(payload: any, towingCompanyId: string) {
    const { vehicle } = payload;
    const towingCompany = await TowingCompany.findById(towingCompanyId).select(
      "vehicles"
    );

    if (!towingCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Towing company not found"
      );
    }

    if (
      towingCompany.vehicles.some((vt) => vt.regNumber === vehicle.regNumber)
    ) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "A vehicle with the same registration number already exists for this business"
      );
    }

    towingCompany.vehicles.push(vehicle);
    await towingCompany.save();
    return;
  }

  async addDriver(payload: any, towingCompany: string) {
    const licenseNumberExists = await TowingDriver.findOne({
      towingCompany,
      licenseNumber: payload.licenseNumber,
    })
      .select("licenseNumber")
      .lean()
      .exec();

    if (licenseNumberExists) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "A driver with this license number exists for this company"
      );
    }
    const driver = await new TowingDriver({
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: payload.phoneNumber,
      licenseNumber: payload.licenseNumber,
      photo: payload.photo,
      towingCompany,
    }).save();

    return driver._id;
  }

  async getMe(_id: string) {
    const towingCompany = await TowingCompany.findById(_id).select(
      "name phoneNumber email address vehicles"
    );

    if (!towingCompany) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "No company found")
    }
    return towingCompany
  }
}

export const towingService = new TowingService();

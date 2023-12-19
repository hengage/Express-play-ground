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

  async addVehicleType(payload: any) {
    const { towingCompanyId, towingVehicleType } = payload;
    const towingCompany = await TowingCompany.findById(towingCompanyId).select(
      "vehicleTypes"
    );

    if (!towingCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Towing company not found"
      );
    }
    towingCompany.vehicleTypes.find((vt) => {
      if (vt.vehicleType === towingVehicleType.vehicleType) {
        throw new HandleException(
          STATUS_CODES.CONFLICT,
          "Vehicle type already exists for the company"
        );
      }

      if (vt.regNumber === towingVehicleType.regNumber) {
        throw new HandleException(
          STATUS_CODES.CONFLICT,
          "A vehicle with this registration number already exists"
        );
      }
    });
    towingCompany.vehicleTypes.push(towingVehicleType);
    await towingCompany.save();
    return;
  }

  async addDriver(payload: any, towingCompany: string) {
    const driver = await new TowingDriver({
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: payload.phoneNumber,
      licenseNumber: payload.licenseNumber,
      photo: payload.photo,
      towingCompany
    }).save();

    return driver._id
  }
}

export const towingService = new TowingService();

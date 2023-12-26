import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
import {
  TransportCompany,
  TransportVehicleType,
} from "../models/transport.models";
import { TransportDriver } from "../models/transportDrivers.model";

class TransportService {
  async create(payload: any) {
    const transportCompany = await new TransportCompany({
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      password: payload.password,
      address: payload.address,
      location: {
        coordinates: payload.coordinates,
      },
      serviceType: payload.serviceType,
    }).save();

    return {
      _id: transportCompany._id,
      name: transportCompany.name,
    };
  }

  async login(payload: any) {
    const transportCompany = await TransportCompany.findOne({
      phoneNumber: payload.phoneNumber,
    })
      .select("phoneNumber password")
      .lean()
      .exec();

    if (!transportCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Company account not found"
      );
    }

    const password = await encryption.compareValues(
      payload.password,
      transportCompany.password
    );
    if (!password) {
      throw new HandleException(
        STATUS_CODES.UNAUTHORIZED,
        "Incorrect password"
      );
    }

    return {
      _id: transportCompany._id,
      phoneNumber: transportCompany.phoneNumber,
    };
  }

  async addVehicle(payload: any, transportCompanyId: string) {
    const { vehicle } = payload;
    const transportCompany = await TransportCompany.findById(
      transportCompanyId
    ).select("vehicles");

    if (!transportCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Towing company not found"
      );
    }

    if (
      transportCompany.vehicles.some((vt) => vt.regNumber === vehicle.regNumber)
    ) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "A vehicle with the same registration number already exists for this business"
      );
    }

    transportCompany.vehicles.push(vehicle);
    await transportCompany.save();
    return;
  }

  async addDriver(payload: any, transportCompany: string) {
    const licenseNumberExists = await TransportDriver.findOne({
      transportCompany,
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
    const driver = await new TransportDriver({
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: payload.phoneNumber,
      licenseNumber: payload.licenseNumber,
      photo: payload.photo,
      transportCompany,
    }).save();

    return driver._id;
  }

  async getMe(_id: string) {
    const transportCompany = await TransportCompany.findById(_id).select(
      "name phoneNumber email address vehicles"
    );

    if (!transportCompany) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "No company found");
    }
    return transportCompany;
  }

  async getVehiclesByServiceType(serviceType: string) {
    const vehicleTypes = TransportVehicleType.find({ serviceType })
      .select("vehicleType")
      .lean()
      .exec();

    return vehicleTypes;
  }
}

export const transportService = new TransportService();

import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
import {
  TransportCompany,
  TransportServiceType,
  TransportVehicleType,
} from "../models/transport.models";
import { TransportDriver } from "../models/transportDrivers.model";
import { TransportTripOrder } from "../models/transportOrders.model";

class TransportService {
  async login(payload: any) {
    const transportCompany = await TransportCompany.findOne({
      vehicleRegNumber: payload.vehicleRegNumber,
    })
      .select("phoneNumber password")
      .lean()
      .exec();
    console.log({ payload });

    console.log({ transportCompany });

    if (!transportCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Transport account not found"
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

  // async addVehicle(payload: any, transportCompanyId: string) {
  //   const { vehicle } = payload;
  //   const transportCompany = await TransportCompany.findById(
  //     transportCompanyId
  //   ).select("vehicles");

  //   if (!transportCompany) {
  //     throw new HandleException(
  //       STATUS_CODES.NOT_FOUND,
  //       "Towing company not found"
  //     );
  //   }

  //   if (
  //     transportCompany.vehicles.some((vt) => vt.regNumber === vehicle.regNumber)
  //   ) {
  //     throw new HandleException(
  //       STATUS_CODES.CONFLICT,
  //       "A vehicle with the same registration number already exists for this business"
  //     );
  //   }

  //   transportCompany.vehicles.push(vehicle);
  //   await transportCompany.save();
  //   return;
  // }

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

    return {
      _id: driver._id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      phoneNumber: driver.phoneNumber,
      licenseNumber: driver.licenseNumber,
      photo: driver.photo,
    };
  }

  async getMe(_id: string) {
    const transportCompany = await TransportCompany.findById(_id).select(
      "name phoneNumber email address vehicleType vehicleRegNumber serviceType"
    );

    if (!transportCompany) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "No company found");
    }
    return transportCompany;
  }

  async getVehiclesByServiceType(serviceType: string) {
    const vehicleTypes = TransportVehicleType.find({ serviceType })
      .select("vehicleType feePerKM transportCompanyPercentage photo")
      .lean()
      .exec();

    return vehicleTypes;
  }

  async getServiceTypes() {
    const serviceTypes = await TransportServiceType.find()
      .select("name")
      .lean()
      .exec();

    return serviceTypes;
  }

  async getTransportCompanyDrivers(transportCompanyId: string) {
    const drivers = await TransportDriver.find({
      transportCompany: transportCompanyId,
    })
      .select("_id firstName lastName photo phoneNumber")
      .lean()
      .exec();
    return drivers;
  }

  async getTransportCompanyDriver(
    transportCompanyId: string,
    driverId: string
  ) {
    const driver = await TransportDriver.findOne({
      _id: driverId,
      transportCompany: transportCompanyId,
    }).select("-__v -transportCompany");

    if (!driver) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Driver not found");
    }
    return driver;
  }

  async findTransportCompanies(payload: {
    pickUpCoordinates: [number, number];
    serviceTypeId: string;
  }) {
    const transportCompanies = await TransportCompany.find({
      location: {
        $near: {
          $geometry: { type: "point", coordinates: payload.pickUpCoordinates },
          $maxDistance: 9000,
        },
      },
      serviceType: payload.serviceTypeId,
    })
      .select({
        name: 1,
        phoneNumber: 1,
        vehicleType: 1,
        vehicleRegNumber: 1,
        location: { coordinates: 1 },
      })
      .lean()
      .exec();

    return transportCompanies;
  }

  async getTransportTripOrders(transportCompanyId: string, page: number) {
    const query = { transportCompany: transportCompanyId };

    const options = {
      page,
      limit: 20,
      select: "createdAt status",
      populate: [
        { path: "customer", select: "firstName lastName" },
        { path: "serviceType", select: "name" },
      ],
      lean: true,
      leanWithId: false,
    };

    const transportTripOrders = TransportTripOrder.paginate(query, options);
    return transportTripOrders;
  }
}

export const transportService = new TransportService();

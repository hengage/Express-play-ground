import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
import { MovingServiceCompany } from "../models/movingServices.model";

class MovingServicesService {
  async signup(payload: any) {
    const msc = await new MovingServiceCompany({
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
      _id: msc._id,
      phoneNumber: msc.phoneNumber,
    };
  }

  async login(payload: any) {
    const msc = await MovingServiceCompany.findOne({
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
    const movingService = await MovingServiceCompany.findById(
      movingServiceId
    ).select("vehicles");

    if (!movingService) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "The business does not exist"
      );
    }

    if (
      movingService.vehicles.some((vt) => vt.regNumber === vehicle.regNumber)
    ) {
      throw new HandleException(
        STATUS_CODES.CONFLICT,
        "A vehicle with the same registration number already exists for this business"
      );
    }

    movingService.vehicles.push(payload.vehicle);
    console.log("added vehicle type");
    await movingService.save();
  }
}

export const movingServicesService = new MovingServicesService();

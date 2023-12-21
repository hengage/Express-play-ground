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

  async addVehicleType(payload: any, movingServiceId: string) {
    const movingService = await MovingServiceCompany.findById(
      movingServiceId
    ).select("vehicleTypes");

    if (!movingService) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "The business does not exist"
      );
    }
    movingService.vehicleTypes.find((vt) => {
      if (vt === payload.vehicleType) {
        throw new HandleException(
          STATUS_CODES.CONFLICT,
          "The vehicle type already exists for this business"
        );
      } 
    });

    movingService.vehicleTypes.push(payload.vehicleType);
    console.log("added vehicle type");
    await movingService.save();
  }
}

export const movingServicesService = new MovingServicesService();

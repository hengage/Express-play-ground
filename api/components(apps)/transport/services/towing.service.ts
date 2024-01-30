import { STATUS_CODES } from "../../../constants";
import { HandleException, encryption } from "../../../utils";
import { towingNotificationService } from "../../notifications";
import {
  TransportCompany,
  TransportVehicleType,
} from "../models/transport.models";
import { towingRepo } from "../repository/towing.repo";

class TowingService {
  async login(payload: any) {
    const towingCompany = await TransportCompany.findOne({
      vehicleRegNumber: payload.vehicleRegNumber,
      serviceType: "c6a56821",
    })
      .select("phoneNumber password")
      .lean()
      .exec();
    console.log({ payload });

    console.log({ towingCompany });

    if (!towingCompany) {
      throw new HandleException(
        STATUS_CODES.NOT_FOUND,
        "Towing account not found"
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

  async findTowingCompanies(payload: { tripOrder: any }) {
    const { tripOrder } = payload;

    const towingCompanies = await towingRepo.findTowingCompanies(
      tripOrder.pickUpCoordinates
    );

    towingCompanies.forEach(async (towingCompany) => {
      await towingNotificationService.notifyCompanyOfOrderRequest(
        tripOrder,
        towingCompany._id
      );
    });

    return towingCompanies;
  }

  async getTowingServiceVehicleTypes() {
    const vehicleTypes = TransportVehicleType.find({
      serviceType: "c6a56821",
    })
      .select("vehicleType feePerKM transportCompanyPercentage photo")
      .lean()
      .exec();

    return vehicleTypes;
  }
}

export const towingService = new TowingService();

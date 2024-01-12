import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import {
  TransportVehicleType,
  TransportServiceType,
  TransportCompany,
} from "../../transport";

class AdminTransportService {
  async createVehicleType(payload: any) {
    console.log(payload);
    const transportVehicleType = await new TransportVehicleType({
      vehicleType: payload.vehicleType,
      serviceType: payload.serviceType,
      photo: payload.photo,
      feePerKM: payload.feePerKM,
      transportCompanyPercentage: payload.transportCompanyPercentage,
    }).save();

    return {
      _id: transportVehicleType._id,
      vehicleType: transportVehicleType.vehicleType,
    };
  }

  async createServiceType(payload: any) {
    const serviceType = await new TransportServiceType({
      name: payload.name,
    }).save();

    return serviceType._id;
  }

  async getServiceTypes() {
    const serviceTypes = await TransportServiceType.find()
      .select("name")
      .lean()
      .exec();

    return serviceTypes;
  }

  async getVehiclesByServiceType(serviceType: string) {
    const vehicleTypes = TransportVehicleType.find({ serviceType })
      .select("vehicleType feePerKM transportCompanyPercentage photo")
      .lean()
      .exec();

    return vehicleTypes;
  }

  async getTransportCompanies(page: number) {
    const query = {};
    const options = {
      page,
      limit: 20,
      select: "name email address",
      lean: true,
      leanWithId: false,
    };
    
    const transportCompanies = await TransportCompany.paginate(query, options);
    return transportCompanies;
  }

  async getCompanyDetails(companyId: string) {
    const transportCompany = await TransportCompany.findById(companyId)
    .select("-__v -location")
    .populate({path: "vehicles.vehicleType", select: "vehicleType"})

    if(!transportCompany) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Company not found")
    }

    return transportCompany;
  }
}

export const adminTransportService = new AdminTransportService();

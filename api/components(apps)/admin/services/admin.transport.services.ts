import { TransportVehicleType, TransportServiceType } from "../../transport";

class AdminTransportService {
  async createVehicleType(payload: any) {
    console.log(payload)
    const transportVehicleType = await new TransportVehicleType({
      vehicleType: payload.vehicleType,
      serviceType: payload.serviceType,
      photo: payload.photo,
      feePerKM: payload.feePerKM,
      transportCompanyPercentage: payload.transportCompanyPercentage,
    }).save();

    return  {
      _id: transportVehicleType._id,
      vehicleType: transportVehicleType.vehicleType
    }
  }

  async createServiceType(payload: any) {
    const serviceType = await new TransportServiceType ({
      name: payload.name,
    }).save()

    return serviceType._id
  }
}

export const adminTransportService = new AdminTransportService()

import { HandleException } from "../../../utils";
import { VehicleType } from "../../maku";
import { DeliveryRate, IDeliveryRate } from "../../orders";
import { ICreateVehicleType } from "../admin.interfacee";

class AdminService {
    public async deliveryRate (payload: IDeliveryRate) {
        try {
            const existingConfig = await DeliveryRate.findOne();
            if (existingConfig) {
              existingConfig.baseFee = payload.baseFee;
              existingConfig.feePerKM = payload.feePerKM;
              existingConfig.riderFeePerKM = payload.riderFeePerKM
              await existingConfig.save();
              return existingConfig
            } else {
              const newConfig = new DeliveryRate({ 
                baseFee: payload.baseFee, 
                feePerKM: payload.feePerKM,
                riderFeePerKM: payload.riderFeePerKM
            });
              await newConfig.save();
              return newConfig
            }
          } catch (error: any) {
            console.error('Error updating/creating delivery pricing:', error.message);
            throw new HandleException(error.status, error.message);
          }
    }

    public async createVehicleType(payload: ICreateVehicleType) {
      try {
        const vehicleType = new VehicleType({
          vehicleType: payload.vehicleType,
          baseFee: payload.baseFee,
          feePerKM: payload.feePerKM,
          riderPercentage: payload.riderPercentage
        })

        const savedVehicleType = await vehicleType.save()
        return savedVehicleType
      } catch (error: any) {
        throw new HandleException(error.status, error.message)
      }
    }
}

export const adminService = new AdminService();
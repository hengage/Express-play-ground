import { HandleException } from "../../../utils";
import { DriverRider } from "../models/driversRiders.models";
import { IDriverRider } from "../models/driversRiders.models.interface";

class DriverRidersService {
        async getDriverOrRiderByPhoneNumber(
            phoneNumber: string,
            selectFields?: string
          ): Promise<IDriverRider> {
            try {
              const query = DriverRider.findOne({
                phoneNumber: { $eq: phoneNumber },
              });
        
              if (selectFields) {
                query.select(selectFields);
              }
        
              const driverRider = await query.exec();
              if (!driverRider) {
                throw new HandleException(401, "Driver or rider not found");
              }
              return driverRider;
            } catch (error: any) {
              throw new Error(error.message);
            }
    }
        async getDriverOrRiderById(
            _id: string,
            selectFields?: string
          ): Promise<IDriverRider> {
            try {
              const query = DriverRider.findById(_id)
        
              if (selectFields) {
                query.select(selectFields);
              }
        
              const driverRider = await query.exec();
              if (!driverRider) {
                throw new HandleException(401, "Driver or rider not found");
              }
              return driverRider;
            } catch (error: any) {
              throw new Error(error.message);
            }
    }
}

export const driverRidersService = new DriverRidersService();
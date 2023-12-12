import { HandleException } from "../../../utils";
import { IDriverRider } from "../driversRiders.interface";
import { DriverRider } from "../models/driversRiders.models";

class DriverRiderRepo {
    public   async getById(
        _id: string,
        selectFields?: string
      ): Promise<IDriverRider | null> {
        try {
          const query = DriverRider.findById(_id);
    
          if (selectFields) {
            query.select(selectFields);
          }
    
          const driverRider = await query.exec();
          if (!driverRider) {
            throw new HandleException(404, "Driver or rider not found");
          }
          return driverRider;
        } catch (error: any) {
          throw new Error(error.message);
        }
      }

      public async getByPhoneNumber(
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
            throw new HandleException(404, "Driver or rider not found");
          }
          return driverRider;
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
}

export const driverRiderRepo = new DriverRiderRepo()
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
                coordinates: payload.coordinates
            }
        }).save()

        return {
            _id: msc._id,
            phoneNumber: msc.phoneNumber
        }
    } 
}

export const movingServicesService = new MovingServicesService()
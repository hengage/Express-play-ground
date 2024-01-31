import { Property } from "../models/property.model";

class PropertyRepository {
  async addProperty(payload: any, landlord: string) {

    const property = await Property.create({
      landlord: landlord,
      title: payload.title,
      description: payload.description,
      numberOfBedrooms: payload.numberOfBedrooms,
      numberOfBathrooms: payload.numberOfBathrooms,
      pets: payload.pets,
      furnished: payload.furnished,
      photos: payload.photos,
      rentPerMonth: payload.rentPerMonth,
      address: payload.address,
      location: {
        coordinates: payload.coordinates,
      },
    });

    return property;
  }
}

export const propertyRepo = new PropertyRepository();

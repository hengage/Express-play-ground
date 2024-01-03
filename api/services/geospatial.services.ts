import { DriverRider } from "../components(apps)/driversAndRiders";

const geohash = require("ngeohash");

function generateGeohash(latitude: number, longitude: number, precision = 9) {
  return geohash.encode(latitude, longitude, precision);
}

async function findClosestDriverOrRider(
  coordinates: [number, number],
  accountType: string,
  distanceInKilometers = 20,
  vehicleType?: string
) {
  //   const targetGeohash = generateGeohash(...coordinates, precision);

  //   const centerPoint = geohash.decode(targetGeohash);
  //   const nearbyGeohashes = geohash.neighbors(targetGeohash);
  // console.log({centerPoint, targetGeohash})
  const filter: {
    accountType: string;
    available: boolean;
    vehicleType?: string;
  } = {
    accountType,
    available: true,
  };

  if (vehicleType) {
    filter.vehicleType = vehicleType;
  }
  const nearbyDriversAndRiders = await DriverRider.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates },
        distanceField: "distance",
        maxDistance: distanceInKilometers * 1000, // convert kilometers to meters
        spherical: true,
      },
    },
    {
      $match: filter,
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        vehicleType: 1,
        phoneNumber: 1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  return nearbyDriversAndRiders;
}

export { findClosestDriverOrRider };

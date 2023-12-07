import { DriverRider } from "../components(apps)/driversAndRiders";

const geohash = require("ngeohash");

function generateGeohash(latitude: number, longitude: number, precision = 9) {
  return geohash.encode(latitude, longitude, precision);
}

async function findClosestDriver(
  coordinates: [number, number],
  accountType: string,
  distanceInKilometers = 20
) {
  //   const targetGeohash = generateGeohash(...coordinates, precision);

  //   const centerPoint = geohash.decode(targetGeohash);
  //   const nearbyGeohashes = geohash.neighbors(targetGeohash);
  // console.log({centerPoint, targetGeohash})
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
      $match: {
        accountType,
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        vehicleType: 1
      },
    },
    {
      $limit: 10,
    },
  ]);

  return nearbyDriversAndRiders;
}

export { findClosestDriver };

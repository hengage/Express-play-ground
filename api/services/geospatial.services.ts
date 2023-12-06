import { DriverRider } from "../components(apps)/driversAndRiders";

const geohash = require("geohash");

function generateGeohash(latitude: number, longitude: number, precision = 9) {
  return geohash.encode(latitude, longitude, precision);
}

async function findClosestDriver(coordinates: [number], accountType: string, precision = 9) {
  const targetGeohash = generateGeohash(...coordinates, precision);

  const nearbyGeohashes = geohash.neighbors(targetGeohash);

  const nearbyDrivers = await DriverRider.find({
    accountType,
    location: {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [
            // Construct a polygon from the neighboring geohashes
            nearbyGeohashes.map((hash: any) => geohash.decode_bbox(hash)),
          ],
        },
      },
    },
  })
    // .sort({
    //   location: {
    //     $near: {
    //       $geometry: {
    //         type: "Point",
    //         coordinates: coordinates,
    //       },
    //     },
    //   },
    // })
    .limit(1);

  return nearbyDrivers;
}

export { findClosestDriver };

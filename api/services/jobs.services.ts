import { Agenda } from "agenda";
import { messengerService } from "../components(apps)/messenger";
import { findClosestDriverOrRider } from "./geospatial.services";
import { notificationService } from "../components(apps)/notifications";
import { DB_URL } from "../config/secrets.config";

const agenda = new Agenda({
  db: {
    address: `${DB_URL}`,
    collection: "aagendaJobs",
  },
  processEvery: '30 seconds'
});

agenda
  .on("ready", () => console.log("Agenda started!"))
  .on("error", () => console.log("Agenda connection error!"));

agenda.define("schedule-messenger-order", async (job: any) => {
  console.log("Running schedule");

  const { order, pickUpCoordinates, searchKMLimit } = job.attrs.data;
  const riders = await findClosestDriverOrRider(
    pickUpCoordinates,
    "rider",
    searchKMLimit
  );
  console.log({ ridersFound: riders });
  if (riders.length > 0) {
    riders.forEach((rider) => {
      notificationService.notifyRiderOfOrder(rider._id, order);
    });
  }
});

export { agenda };

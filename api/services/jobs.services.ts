import cron from "node-cron";
import {
  IMessengerOrder,
  messengerService,
} from "../components(apps)/messenger";

const scheduleMessengerPickUp = (
  order: IMessengerOrder,
  payload: any,
  searchKMLimit: number
) => {
  if (order.scheduledPickUpTime) {
    const expression = dateToCronExpression(order.scheduledPickUpTime);
    console.log({ expression });
    const job = cron.schedule(
      expression,
      async function () {
        console.log("Cron job running!");

        // orderFunc;
        messengerService.notifyNearestRiders(
          payload.pickUpCoordinates,
          payload,
          searchKMLimit
        );
        console.log("Finished messenger job");
      },
      {
          timezone: "Africa/Accra"
      }
    );

    job.start();
  }
};


function dateToCronExpression(date: Date): string {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  return `${minute} ${hour} ${dayOfMonth} ${month} *`;
}

export { scheduleMessengerPickUp };

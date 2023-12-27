import cron from "node-cron";
import { IMessengerOrder } from "../components(apps)/messenger";

const scheduleMessengerPickUp = (
  order: IMessengerOrder,
  orderFunc: Promise<void>
) => {
  if (order.scheduledPickUpTime) {
    const expression = dateToCronExpression(order.scheduledPickUpTime);
    const job = cron.schedule(expression, function () {
      orderFunc;
    }, {
        timezone: "Africa/Accra"
    });

    job.start()
  }
};

function dateToCronExpression(date: Date): string {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

export {scheduleMessengerPickUp}
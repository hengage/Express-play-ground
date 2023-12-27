import cron from "node-cron";
import { IMessengerOrder } from "../components(apps)/messenger";

const scheduleMessengerPickUp = (
  order: IMessengerOrder,
  orderFunc: () => Promise<void>
) => {
  if (order.scheduledPickUpTime) {
    const expression = dateToCronExpression(order.scheduledPickUpTime);
    console.log({expression})
    console.log("Starting messenger job.......")
    const scheduledTime = order.scheduledPickUpTime.getTime();
    const currentTime = new Date().getTime();
    const delay = Math.max(scheduledTime - currentTime, 0);

    console.log({delay})
    setTimeout(async () => {
      try {
        await orderFunc(); 
        console.log("Job completed successfully.");
      } catch (error) {
        console.error("Error in job:", error);
      }
    }, delay);
    console.log("Finished messenger job")
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

export {scheduleMessengerPickUp}
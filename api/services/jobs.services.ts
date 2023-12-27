import cron from "node-cron";
import {
  IMessengerOrder,
  messengerService,
} from "../components(apps)/messenger";
import { redisClient } from "./redis.service";

class JobScheduler {
  private static instance: JobScheduler;
  private job: cron.ScheduledTask | null = null;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): JobScheduler {
    if (!JobScheduler.instance) {
      JobScheduler.instance = new JobScheduler();
    }

    return JobScheduler.instance;
  }

  public start() {
    console.log("Started job from start method");
    this.loadAndScheduleJobs();
  }

  private async loadAndScheduleJobs(): Promise<void> {
    console.log("Loading jobs....");

    try {
      // Load job data from Redis
      const rawData = await redisClient.get("jobData");

      if (rawData) {
        const jobData = JSON.parse(rawData);

        // Schedule jobs based on the loaded data
        this.scheduleJobs(jobData);
      }
    } catch (error: any) {
      console.error("Error loading job data from Redis:", error.message);
    }
  }

  private async saveJobData(jobData: any): Promise<void> {
    try {
      // Save job data to Redis
      await redisClient.set("jobData", JSON.stringify(jobData));
    } catch (error: any) {
      console.error("Error saving job data to Redis:", error.message);
    }
  }

  private scheduleJobs(jobData: any): void {
    // Iterate through job data and schedule jobs
    for (const jobInfo of jobData) {
      this.scheduleMessengerPickUp(
        jobInfo.order,
        jobInfo.payload,
        jobInfo.searchKMLimit
      );
    }
  }

  public async scheduleMessengerPickUp(
    order: IMessengerOrder,
    payload: any,
    searchKMLimit: number
  ): Promise<void> {
    if (order.scheduledPickUpTime) {
      const expression = dateToCronExpression(
        new Date(order.scheduledPickUpTime)
      );
      console.log({ expression });

      const job = cron.schedule(
        expression,
        async () => {
          console.log("Cron job running!");

          messengerService.notifyNearestRiders(
            payload.pickUpCoordinates,
            payload,
            searchKMLimit
          );

          console.log("Finished messenger job");
        },
        {
          timezone: "Africa/Accra",
        }
      );

      // Optionally start the job immediately upon scheduling
      job.start();

      const existingJobData = await redisClient.get("jobData");
      const parsedExistingJobData = existingJobData
        ? JSON.parse(existingJobData)
        : [];
      const updatedJobData = [
        ...parsedExistingJobData,
        { order, payload, searchKMLimit },
      ];

      // Save the updated job data to Redis
      await this.saveJobData(updatedJobData);
    }
  }
}

function dateToCronExpression(date: Date): string {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  return `${minute} ${hour} ${dayOfMonth} ${month} *`;
}

// export { scheduleMessengerPickUp };

export const jobScheduler = JobScheduler.getInstance();

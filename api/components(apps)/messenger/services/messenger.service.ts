import { DateTime, Settings } from "luxon";
import {
  agenda,
  findClosestDriverOrRider,
  smsService,
} from "../../../services";
import {
  messengerNotificationService,
  notificationService,
} from "../../notifications";
import { IMessengerOrder } from "../messenger.interface";
import { messengerRepo } from "../repository/messenger.repo";
import { HandleException } from "../../../utils";
import { STATUS_CODES } from "../../../constants";
class Messengerservice {
  public async notifyNearestRiders(
    pickUpCoordinates: [number, number],
    order: IMessengerOrder,
    searchKMLimit: number
  ) {
    const riders = await findClosestDriverOrRider(
      pickUpCoordinates,
      "rider",
      searchKMLimit
    );
    console.log({ ridersFound: riders });
    if (riders.length > 0) {
      riders.forEach((rider) => {
        messengerNotificationService.notifyRiderOfOrder(rider._id, order);
      });
    }
  }

  async createOrder(payload: any, searchKMLimit: number) {
    const order = await messengerRepo.createOrder(payload);
    const orderData = await messengerRepo.getOrder(order._id);
    if (order.scheduledPickUpTime) {
      console.log({ scheduledPickUpTime: order.scheduledPickUpTime });
      console.log("scheduled pick up");

      const fiveMinutesBefore = new Date(
        order.scheduledPickUpTime.getTime() - 5 * 60000
      );
      await agenda.schedule(fiveMinutesBefore, "schedule-messenger-order", {
        orderData,
        pickUpCoordinates: payload.pickUpCoordinates,
        searchKMLimit,
      });
    } else {
      this.notifyNearestRiders(
        payload.pickUpCoordinates,
        orderData,
        searchKMLimit
      );
    }

    return order;
  }

  async remindCustomerOfScheduledOrder(
    customerPhoneNumber: string,
    scheduledPickUpTime: Date
  ) {
    const formattedDate = DateTime.fromJSDate(
      scheduledPickUpTime
    ).toLocaleString(DateTime.DATETIME_MED);

    smsService.sendSms({
      recipientPhoneNumber: customerPhoneNumber,
      message: `You have a scheduled package delivery for ${formattedDate}`,
    });
  }

  async assignRider(orderId: string, riderId: string) {
    const order = await messengerRepo.assignRider(orderId, riderId);
    await messengerNotificationService.notifyCustomerOfOrderStatus(
      order,
      "Rider assigned",
      "A rider has been assigned to pick up and deliver your parcel"
    );
    return order;
  }

  async setStatusToPickedUp(orderId: string) {
      const order = await messengerRepo.setStatusToPickedUp(orderId);
      await messengerNotificationService.notifyCustomerOfOrderStatus(
        order,
        "Parcel picked up",
        "Your parcel has been picked up and is on the way to you"
      );
  }

  async setStatusToArrived(orderId: string) {
    const order = await messengerRepo.setStatusToArrived(orderId);
    await messengerNotificationService.notifyCustomerOfOrderStatus(
      order,
      "Parcel has arrived",
      "Your parcel has arrived the drop off location. Please go pick it up"
    );
  }

  async setStatusToDelivered(orderId: string) {
    const order = await messengerRepo.setStatusToDelivered(orderId);
    await messengerNotificationService.notifyCustomerOfOrderStatus(
      order,
      "Parcel delivered",
      "Your parcel has been delivered to you"
    );
  }
}

export const messengerService = new Messengerservice();

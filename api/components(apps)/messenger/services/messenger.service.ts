import {
  agenda,
  findClosestDriverOrRider,
  smsService,
} from "../../../services";
import { notificationService } from "../../notifications";
import { IMessengerOrder } from "../messenger.interface";
import { messengerRepo } from "../repository/messenger.repo";
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
        notificationService.notifyRiderOfOrder(rider._id, order);
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
  }

  async remindCustomerOfScheduledOrder(customerPhoneNumber: string) {
    smsService.sendSms({
      recipientPhoneNumber: customerPhoneNumber,
      message: "Your scheduled package delivery is in 5 minutes",
    });
  }
}

export const messengerService = new Messengerservice();

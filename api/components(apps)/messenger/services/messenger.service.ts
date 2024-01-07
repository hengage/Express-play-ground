import { DateTime } from 'luxon';

import { agenda, findClosestDriverOrRider } from "../../../services";
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
    console.log({ pickupCoord: payload.pickUpCoordinates });
    if (order.scheduledPickUpTime) {
      console.log({scheduledPickUpTime: order.scheduledPickUpTime})
      console.log("scheduled pick up");
      agenda.schedule(order.scheduledPickUpTime, "schedule-messenger-order", {
        order,
        pickUpCoordinates: payload.pickUpCoordinates,
        searchKMLimit,
      });
    } else {
      this.notifyNearestRiders(
        payload.pickUpCoordinates,
        payload,
        searchKMLimit
      );
    }
  }
}

export const messengerService = new Messengerservice();

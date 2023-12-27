import {
  findClosestDriverOrRider,
  scheduleMessengerPickUp,
} from "../../../services";
import { notificationService } from "../../notifications";
import { IMessengerOrder } from "../messenger.interface";
import { messengerRepo } from "../repository/messenger.repo";

class Messengerservice {
  private async notifyNearestRiders(
    pickUpCoordinates: [number, number],
    order: IMessengerOrder,
    searchKMLimit: number
  ) {
    const riders = await findClosestDriverOrRider(
      pickUpCoordinates,
      "rider",
      searchKMLimit
    );

    if (riders.length > 0) {
      riders.forEach((rider) => {
        notificationService.notifyRiderOfOrder(rider._id, order);
      });
    }
  }

  async createOrder(payload: any, searchKMLimit: number) {
    const order = await messengerRepo.createOrder(payload);
    if (order.scheduledPickUpTime) {
      scheduleMessengerPickUp(
        order,
        this.notifyNearestRiders(
          payload.pickUpCoordinates,
          payload,
          searchKMLimit
        )
      );
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

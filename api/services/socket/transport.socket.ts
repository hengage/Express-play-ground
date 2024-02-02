import { Socket } from "socket.io";
import {
    towingRepo,
  towingService,
  transportRepo,
  transportService,
} from "../../components(apps)/transport";
import { redisClient } from "../redis.service";

function listenForTransportServiceEvents(socket: Socket) {
  socket.on("find-tow-companies", async (message: any) => {
    const { tripOrder } = message;
    try {
      const towCompanies = await towingService.findTowingCompanies({
        tripOrder,
      });
      console.log({ towCompanies: JSON.stringify(towCompanies) });
      socket.emit("found-tow-companies", towCompanies);
    } catch (error: any) {
      socket.emit("find-tow-companies-error");
    }
  });

  socket.on("find-transport-companies", async (message: any) => {
    const { tripOrder } = message;
    try {
      const transportCompanies = await transportService.findTransportCompanies({
        tripOrder,
      });
      socket.emit("found-transport-companies", transportCompanies);
    } catch (error: any) {
      socket.emit("find-transport-companies-error", error.message);
    }
  });

  socket.on("update-transport-company-location", async (message: any) => {
    // This function upates all transport company location, INLCUDING
    // towing companies.
    try {
      const { transportCompanyId, coordinates } = message;
      transportRepo.updateLocation({ transportCompanyId, coordinates });
    } catch (error: any) {
      socket.emit("update-transport-company-location-error", error.message);
    }
  });

  socket.on("fcm-transport-company-device-token", async (message) => {
    const { transportCompanyId, deviceToken } = message;
    await redisClient.set(`device-token:${transportCompanyId}`, deviceToken);
  });

  socket.on("fcm-towing-company-device-token", async (message) => {
    const { towingCompanyId, deviceToken } = message;
    console.log({ towingCompanyId, deviceToken });

    await redisClient.set(`device-token:${towingCompanyId}`, deviceToken);
  });

  socket.on("transport-company-start-working", async (message) => {
    try {
      await transportRepo.startWorking(message.transportCompanyId);
    } catch (error: any) {
      socket.emit("transport-company-start-working-error", error.message);
    }
  });

  socket.on("transport-company-stop-working", async (message) => {
    try {
      await transportRepo.stopWorking(message.transportCompanyId);
    } catch (error: any) {
      socket.emit("transport-company-stop-working-error", error.message);
    }
  });

  socket.on("create-towing-order", async (message) => {
    try {
      const { tripOrder } = message;
      const towingOrder = await towingRepo.createOrder(tripOrder);
      socket.emit("created-towing-order", towingOrder);
    } catch (error: any) {
      socket.emit("create-towing-order-error", error);
    }
  });

  socket.on("create-transport-order", async (message) => {
    try {
      const { tripOrder } = message;
      console.log({ message });
      const transportOrder = await transportRepo.createTransportOrder(
        tripOrder
      );
      socket.emit("created-transport-order", transportOrder);
    } catch (error: any) {
      socket.emit("create-transport-order-error", error);
    }
  });
}

export { listenForTransportServiceEvents };

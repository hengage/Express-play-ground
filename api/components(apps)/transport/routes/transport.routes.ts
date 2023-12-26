import { Router } from "express";
import { transportController } from "../controllers/transport.controller";
import { jwtUtils } from "../../../utils";

class TransportRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route("/create-company").post(transportController.create);
    this.router.route("/login").post(transportController.login);

    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.route("/add-vehicle").patch(transportController.addVehicle);
    this.router.route("/add-driver").post(transportController.addDriver);
    this.router.route("/me").get(transportController.getMe);
    this.router.route("/service-type/:serviceTypeId/vehicle-types").get(transportController.getVehiclesByServiceType)
  }
}

export const transportRoutes = new TransportRoutes();
import { Router } from "express";
import { jwtUtils } from "../../../utils";
import { vehicleRentalController } from "../controllers/vehicleRental.controller";

class VehicleRentalRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(`/signup`).post(vehicleRentalController.signup);
    this.router.route("/login").post(vehicleRentalController.login);

    this.router.use(jwtUtils.verifyTokenMiddleware);

    this.router
      .route("/add-vehicle")
      .patch(vehicleRentalController.addVehicle);
  }
}

export const vehicleRentalRoutes = new VehicleRentalRoutes();

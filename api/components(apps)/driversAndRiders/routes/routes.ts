import { Router } from "express";
import { driversRidersController } from "../controllers/driversRidersControllers";
import { jwtUtils } from "../../../utils";

class DriversRidesrRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`/signup`, driversRidersController.signup);
    this.router.post(`/login`, driversRidersController.login);

    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.patch(
      "/:driverRiderId/rate",
      driversRidersController.rateDriverOrRider
    );
    this.router.route("/me").get(driversRidersController.getMe);
    this.router
      .route("/maku/trip-history")
      .get(driversRidersController.makuTripHistory);
  }
}

export const driversRidesrRoutes = new DriversRidesrRoutes();

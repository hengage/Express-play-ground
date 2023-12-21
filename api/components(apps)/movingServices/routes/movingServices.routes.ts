import { Router } from "express";
import { jwtUtils } from "../../../utils";
import { movingServicesController } from "../controllers/movingServices.controller";

class MovingServicesRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(`/signup`).post(movingServicesController.signup);
    this.router.route("/login").post(movingServicesController.login);

    this.router.use(jwtUtils.verifyTokenMiddleware);

    this.router
      .route("/add-vehicle")
      .patch(movingServicesController.addVehicle);
  }
}

export const movingServicesRoutes = new MovingServicesRoutes();

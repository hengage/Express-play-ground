import { Router } from "express";
import { jwtUtils } from "../../../utils";
import { movingServicesController } from "../controllers/movingServices.controller";

class MovingServicesRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.route(`/signup`).post(movingServicesController.signup);
    this.router.route("/login").post(movingServicesController.login);
  }
}

export const movingServicesRoutes = new MovingServicesRoutes();

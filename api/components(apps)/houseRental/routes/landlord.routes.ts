import { Router } from "express";
import { landlordController } from "../controllers/lanlord.controller";
import { jwtUtils } from "../../../utils";

class LandlordRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.route("/signup").post(landlordController.signup);
    this.router.route("/login").post(landlordController.login);

    this.router.use(jwtUtils.verifyTokenMiddleware);

    this.router.route("/").patch(landlordController.update);
  }
}

export const landlordRoutes = new LandlordRoutes();

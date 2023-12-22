import { Router } from "express";
import { towingController } from "../controllers/towing.controller";
import { jwtUtils } from "../../../utils";

class TowingRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route("/create-company").post(towingController.create);
    this.router.route("/login").post(towingController.login);

    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.route("/add-vehicle").patch(towingController.addVehicle);
    this.router.route("/add-driver").post(towingController.addDriver);
    this.router.route("/me").get(towingController.getMe);
  }
}

export const towingRoutes = new TowingRoutes();
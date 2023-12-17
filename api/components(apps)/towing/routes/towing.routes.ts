import { Router } from "express";
import { towingController } from "../controllers/towing.controller";

class TowingRoutes {
  public router: Router;
  
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route("/create-company").post(towingController.create);
  }
}

export const towingRoutes = new TowingRoutes();

import { Router } from "express";
import { landlordController } from "../controllers/lanlord.controller";

class LandlordRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.route("/landlord/signup").post(landlordController.signup);
  }
}

export const landlordRoutes = new LandlordRoutes();

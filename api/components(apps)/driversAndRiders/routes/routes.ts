import { Router } from "express";
import { driversRidersController } from "../controllers/driversRidersControllers";

class DriversRidesrRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`/create`, driversRidersController.signup);
  }
}

export const driversRidesrRoutes = new DriversRidesrRoutes();

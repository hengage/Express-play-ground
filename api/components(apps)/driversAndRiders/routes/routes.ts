import { Router } from "express";
import { driversRidersController } from "../controllers/driversRidersControllers";

class DriversRidesrRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`/signup`, driversRidersController.signup);
    this.router.post(`/login`, driversRidersController.login);
  }
}

export const driversRidesrRoutes = new DriversRidesrRoutes();

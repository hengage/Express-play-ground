import { Router } from "express";
import { makuController } from "../controllers/maku.controller";

class MakuRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }
  public initializeRoutes() {
    this.router.route('/types').get(makuController.getVehicleTypes)
  }
}

export const makuRoutes = new MakuRoutes()
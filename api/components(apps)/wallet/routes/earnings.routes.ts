import { Router } from "express";
import { earningController } from "../controllers/earnings.controller";

class EarningsRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
  }
  async initializeRoutes() {
    this.router.route("/").get(earningController.getEarnings);
  }
}

export const earningsRoutes = new EarningsRoutes();

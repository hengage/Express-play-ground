import { Router } from "express";
import { transactionsController } from "../controllers/transactions.controller";

class TransactionsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.route("/").get(transactionsController.getTransactionsForUser);
  }
}

export const transactionsRoutes = new TransactionsRoutes();
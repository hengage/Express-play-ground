import { Router } from "express";
import { customerController } from "../controllers/customer.controller";

class CustomersRoutes {
  public path = "";
  public router = Router();

  constructor() {
    this.path;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/create`, customerController.signup);
  }
}

export const customersRoutes = new CustomersRoutes();

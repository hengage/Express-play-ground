import { Router } from "express";
import { customerController } from "../controllers/customer.controller";

class CustomersRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`/create`, customerController.signup);
  }
}

export const customersRoutes = new CustomersRoutes();

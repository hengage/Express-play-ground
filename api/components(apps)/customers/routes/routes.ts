import { Router } from "express";
import { customerController } from "../controllers/customer.controller";

class CustomersRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`/signup`, customerController.signup);
    this.router.post(`/login`, customerController.login);
  }
}

export const customersRoutes = new CustomersRoutes();

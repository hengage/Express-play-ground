import { Router } from "express";
import { customerController } from "../controllers/customers.controller";

class CustomersRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`/signup`, customerController.signup);
    this.router.post(`/login`, customerController.login);
    this.router.route('/me/').get(customerController.getMe)
  }
}

export const customersRoutes = new CustomersRoutes();

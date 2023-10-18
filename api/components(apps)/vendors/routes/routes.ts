import { Router } from "express";
import { vendorController } from "../controllers/vemdors.controllers";

class VendorsRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route(`/signup`).post(vendorController.signup);
    this.router.route(`/login`).post(vendorController.login);
  }
}

export const vendorsRoutes = new VendorsRoutes();

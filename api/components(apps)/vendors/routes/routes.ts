import { Router } from "express";
import { vendorController } from "../controllers/vemdors.controllers";

class VendorsRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`/signup`, vendorController.signup);
  }
}

export const vendorsRoutes = new VendorsRoutes();

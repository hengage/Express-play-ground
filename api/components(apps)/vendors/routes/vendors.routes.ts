import { Router } from "express";
import { vendorController } from "../controllers/vemdors.controllers";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { jwtUtils } from "../../../utils";

class VendorsRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route(`/signup`).post(vendorController.signup);
    this.router.route(`/login`).post(vendorController.login);

    this.router.use(jwtUtils.verifyTokenMiddleware)
    this.router.route(`/shops`).get(vendorController.getShops);
  }
}

export const vendorsRoutes = new VendorsRoutes();

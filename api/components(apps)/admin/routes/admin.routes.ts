import { Router } from "express";
import { jwtUtils } from "../../../utils";
import { adminController } from "../controllers/admin.controller";

class AdminRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {

    // this.router.use(jwtUtils.verifyTokenMiddleware)
    this.router.route('/delivery-rate').post(adminController.deliveryRate);
  }
}

export const adminRoutes = new AdminRoutes();

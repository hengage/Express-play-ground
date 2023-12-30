import { Router } from "express";
import { customerController } from "../controllers/customers.controller";
import { jwtUtils } from "../../../utils";

class CustomersRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`/signup`, customerController.signup);
    this.router.post(`/login`, customerController.login);

    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.route("/me").get(customerController.getMe);
    this.router.route("/me/update").patch(customerController.updateProfile);
    this.router.route("/orders").get(customerController.getOrders);
    this.router.route("/me/delete").post(customerController.deleteAccount);
    this.router
      .route("/maku/trip-history")
      .get(customerController.makuTripHistory);
    this.router
      .route("/maku/trip/:tripId")
      .get(customerController.getmakuTripDetails);
  }
}

export const customersRoutes = new CustomersRoutes();

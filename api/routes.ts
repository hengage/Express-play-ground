import { Router } from "express";
import { customersRoutes } from "./components(apps)/customers";
import { vendorsRoutes } from "./components(apps)/vendors";
import { shopsRoutes } from "./components(apps)/shops";
import { mediaRoutes } from "./components(apps)/media";
import { driversRidesrRoutes } from "./components(apps)/driversAndRiders";
import { authRoutes } from "./components(apps)/auth";
import { productsRoutes } from "./components(apps)/products";
import { ordersRoutes } from "./components(apps)/orders";
import { adminRoutes } from "./components(apps)/admin";
import { notificationsRoutes } from "./components(apps)/notifications";
import { makuRoutes } from "./components(apps)/maku";
import { transportRoutes } from "./components(apps)/transport";
import { movingServicesRoutes } from "./components(apps)/movingServices";
import { vehicleRentalRoutes } from "./components(apps)/vehicleRental";

class Routes {
  /*
        Imports and sets up all the necessary routes classes for use in the application.
        The main purpose of this class is to provide a centralized location to manage
        the routing configuration for the application, making it easier  to add, modify, or remove routes as needed.
    */
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use("/customers", customersRoutes.router);
    this.router.use("/drivers-riders", driversRidesrRoutes.router);
    this.router.use("/vendor", vendorsRoutes.router);
    this.router.use("/shops", shopsRoutes.router);
    this.router.use("/media", mediaRoutes.router);
    this.router.use("/auth", authRoutes.router);
    this.router.use("/products", productsRoutes.router);
    this.router.use("/orders", ordersRoutes.router);
    this.router.use("/admin", adminRoutes.router);
    this.router.use("/notifications", notificationsRoutes.router);
    this.router.use("/maku-cab", makuRoutes.router)
    this.router.use("/transport", transportRoutes.router)
    this.router.use("/moving-services", movingServicesRoutes.router)
    this.router.use("/vehicle-rental", vehicleRentalRoutes.router)
  }
}

export const routes = new Routes();

import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { adminDriversController } from "../controllers/admin.driversController";
import { adminRidersController } from "../controllers/admin.ridersController";
import { apiKeyMiddleware } from "../../../middleware";
import { adminTransportServiceController } from "../controllers/admin.transportController";
import { adminOpsForVendorsController } from "../controllers/admin.vendorsController";
import { adminOpsForOrdersController } from "../controllers/admin.ordersController";
import { adminOpsForCustomersController } from "../controllers/admin.customersController";
import { adminOpsForMessengerController } from "../controllers/admin.messengerService.controller";
import { adminOpsCustomersRoutes } from "./customers.routes";
import { adminOpsVendorsRoutes } from "./vendors.routes";
import { adminOpsOrdersRoutes } from "./orders.routes";
import { adminOpsDriversRoutes } from "./drivers.routes";
import { adminOpsRidersRoutes } from "./riders.routes";
import { adminOpsTransportServiceRoutes } from "./transport.routes";
import { adminOpsShopsRoutes } from "./shops.routes";
import { adminOpsMakuRoutes } from "./maku.routes";

class AdminRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.use(apiKeyMiddleware);

    this.router.use("/maku", adminOpsMakuRoutes.router);
    this.router.use("/shops", adminOpsShopsRoutes.router);
    this.router.use("/customers", adminOpsCustomersRoutes.router);
    this.router.use("/vendors", adminOpsVendorsRoutes.router);
    this.router.use("/orders", adminOpsOrdersRoutes.router);
    this.router.use("/drivers", adminOpsDriversRoutes.router);
    this.router.use("/riders", adminOpsRidersRoutes.router);
    this.router.use("/transport", adminOpsTransportServiceRoutes.router);

    // Messenger service
    this.router
      .route("/messenger-service/create-package-type")
      .post(adminOpsForMessengerController.createPackageType);
  }
}

export const adminRoutes = new AdminRoutes();

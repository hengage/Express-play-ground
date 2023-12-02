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
    this.router.route("/create-shop-type").post(adminController.createShopType);
    this.router
      .route(`/add-shop-category/:shopTypeId`)
      .post(adminController.addcategory);
    this.router
      .route("/update-shop-type/:shopTypeId")
      .patch(adminController.updateShopType);
    this.router
      .route("/update-shop-category/:categoryId")
      .patch(adminController.updateCategory);
    this.router.route("/delivery-rate").post(adminController.deliveryRate);
    this.router.route("/vehicle-type").post(adminController.createVehicleType);
    this.router
      .route("/vehicle-type/:vehicleTypeId")
      .patch(adminController.updateVehicleType);
    this.router.route("/drivers").get(adminController.getDrivers)
    this.router.route("/riders").get(adminController.getRiders)
  }
}

export const adminRoutes = new AdminRoutes();

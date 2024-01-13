import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { adminDriversController } from "../controllers/admin.driversController";
import { adminRidersController } from "../controllers/admin.RiderController";
import { apiKeyMiddleware } from "../../../middleware";
import { adminTransportServiceController } from "../controllers/admin.transportController";
import { adminOpsForVendorsController } from "../controllers/admin.vendorsController";
import { adminOpsForOrdersController } from "../controllers/admin.ordersController";
import { adminOpsForCustomersController } from "../controllers/admin.customersController";

class AdminRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.use(apiKeyMiddleware);
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

    // CUSTOMERS
    this.router
      .route("/customers")
      .get(adminOpsForCustomersController.getCustomers);
    this.router
      .route("/customers/:customerId")
      .get(adminOpsForCustomersController.getCustomerDetails);

    //Vendors
    this.router.route("/vendors").get(adminOpsForVendorsController.getVendors);
    this.router
      .route("/vendors/:vendorId")
      .get(adminOpsForVendorsController.getVendorDetails);

    // Orders
    this.router.route("/orders").get(adminOpsForOrdersController.getOrders);
    this.router
      .route("/orders/:orderId")
      .get(adminOpsForOrdersController.getOrderDetails);

    //Drivers
    this.router.route("/drivers").get(adminDriversController.getDrivers);
    this.router
      .route("/drivers/:driverId")
      .get(adminDriversController.getDriverById);
    this.router
      .route("/drivers/:driverId")
      .patch(adminDriversController.updateDriver);
    this.router
      .route("/drivers/:driverId")
      .delete(adminDriversController.deleteDriver);

    //Riders
    this.router.route("/riders").get(adminRidersController.getRiders);
    this.router
      .route("/riders/:riderId")
      .get(adminRidersController.getRiderById);

    //Transport services
    this.router
      .route("/transport/create-vehicle-type")
      .post(adminController.createTransportVehicleType);
    this.router
      .route("/transport/create-service-type")
      .post(adminController.createTransportServiceType);
    this.router
      .route("/transport/service-types")
      .get(adminTransportServiceController.getServiceTypes);
    this.router
      .route("/transport/service-types/:serviceTypeId/vehicle-types")
      .get(adminTransportServiceController.getVehiclesByServiceType);
    this.router
      .route("/transport/companies")
      .get(adminTransportServiceController.getCompanies);

    this.router
      .route("/transport/companies/:companyId")
      .get(adminTransportServiceController.getCompanyDetails);

    this.router
      .route("/transport/airport")
      .post(adminTransportServiceController.addAirport);
    this.router
      .route("/transport/airport")
      .get(adminTransportServiceController.getAllAirports);
  }
}

export const adminRoutes = new AdminRoutes();

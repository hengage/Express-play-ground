import { Router } from "express";
import { adminOpsForVendorsController } from "../controllers/admin.vendorsController";

class AdminOpsVendorsRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.route("/").get(adminOpsForVendorsController.getVendors);
    this.router
      .route("/:vendorId")
      .get(adminOpsForVendorsController.getVendorDetails);
    this.router
      .route("/:vendorId/approve")
      .patch(adminOpsForVendorsController.approveVendor);
  }
}

export const adminOpsVendorsRoutes = new AdminOpsVendorsRoutes();

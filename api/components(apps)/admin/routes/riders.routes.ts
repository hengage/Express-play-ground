import { Router } from "express";
import { adminOpsForCustomersController } from "../controllers/admin.customersController";
import { adminRidersController } from "../controllers/admin.ridersController";

class AdminOpsRidersRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.route("/").get(adminRidersController.getRiders);
    this.router
      .route("/:riderId")
      .get(adminRidersController.getRiderDetails);

    this.router
      .route("/:riderId")
      .patch(adminRidersController.updateRider);
    this.router
      .route("/:riderId")
      .delete(adminRidersController.deleteRider);
    this.router
      .route("/unapproved")
      .get(adminRidersController.getUnapprovedRiders);
    this.router
      .route("/:riderId/approve")
      .get(adminRidersController.approveRider);

  }
}

export const adminOpsRidersRoutes = new AdminOpsRidersRoutes();

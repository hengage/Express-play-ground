import { Router } from "express";
import { adminOpsForCustomersController } from "../controllers/admin.customersController";

class AdminOpsCustomersRoutes {
  public router: Router;
  
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router
      .route("/")
      .get(adminOpsForCustomersController.getCustomers);
    this.router
      .route("/:customerId")
      .get(adminOpsForCustomersController.getCustomerDetails);
  }
}

export const adminOpsCustomersRoutes = new AdminOpsCustomersRoutes();

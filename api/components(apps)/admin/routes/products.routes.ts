import { Router } from "express";
import { adminOpsForProductsController } from "../controllers/admin.productsController";

class AdminOpsProductsRoute {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.route("/").get(adminOpsForProductsController.getProducts);
  }
}

export const adminOpsProductsRoute = new AdminOpsProductsRoute();

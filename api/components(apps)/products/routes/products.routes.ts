import { Router } from "express";
import { productsController } from "../controllers/products.controller";

class ProductsRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route(`/new/:shopId`).post( productsController.addProducts);
  }
}

export const productsRoutes = new ProductsRoutes();

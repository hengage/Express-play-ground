import { Router } from "express";
import { productsController } from "../controllers/products.controller";
import { jwtUtils } from "../../../utils";

class ProductsRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.route(`/new/:shopId`).post(productsController.addProducts);
    this.router.route(`/:productId`).get(productsController.getProductById);
    this.router
      .route(`/category/:categoryId`)
      .get(productsController.getProductsByCategory);
  }
}

export const productsRoutes = new ProductsRoutes();

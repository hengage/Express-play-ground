import { Router } from "express";
import { shopController } from "../controllers/shops.controller";
import { jwtUtils } from "../../../utils";

class ShopsRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route(`/category`).post(shopController.addcategory);
    this.router.route(`/categories`).get(shopController.getAllCategories);

    this.router.use(jwtUtils.verifyTokenMiddleware)
    this.router.route(`/create/`).post(shopController.createShop);
    this.router.route(`/:shopId/products`).get( shopController.getProductsForAshop);

  }
}

export const shopsRoutes = new ShopsRoutes();

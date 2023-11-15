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
    this.router.route('/type').post(shopController.createShopType)

    this.router.use(jwtUtils.verifyTokenMiddleware)
    this.router.route(`/create/`).post(shopController.createShop);
    this.router.route(`/:shopId/products`).get( shopController.getProductsForAshop);
    this.router.route("/types").get( shopController.getShopTypes)
    this.router.route("/types/:shopTypeId/categories").get( shopController.getCategoriesByShopType)
  }
}

export const shopsRoutes = new ShopsRoutes();
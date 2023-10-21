import { Router } from "express";
import { shopController } from "../controllers/shops.controller";

class ShopsRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route(`/category`).post(shopController.addcategory);
    this.router.route(`/categories`).get(shopController.getAllCategories);
    this.router.route(`/:vendorId`).post(shopController.createShop);
  }
}

export const shopsRoutes = new ShopsRoutes();

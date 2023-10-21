import { Router } from "express";
import { shopController } from "../controllers/shops.controller";

class ShopsRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.route(`/category/create`).post(shopController.addcategory);
    this.router.route(`/create/:vendorId`).post(shopController.createShop);
    this.router.route(`/categories`).get(shopController.getAllCategories);
  }
}

export const shopsRoutes = new ShopsRoutes();

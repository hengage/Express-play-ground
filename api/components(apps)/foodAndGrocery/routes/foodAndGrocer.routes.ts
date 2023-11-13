import { Router } from "express";
import { jwtUtils } from "../../../utils";
import { foodAndGroceryController } from "../controllers/foodAndGrocery.controller";

class FoodAndGroceryRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.use(jwtUtils.verifyTokenMiddleware);
    this.router.route(`/create-shop`).post(foodAndGroceryController.createShop);
  }
}
export const foodAndGroceryRoutes = new FoodAndGroceryRoutes();

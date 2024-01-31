import { Router } from "express";
import { propertyController } from "../controllers/property.controller";
import { jwtUtils } from "../../../utils";

class PropertyRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(jwtUtils.verifyTokenMiddleware)
    this.router.route("/add").post(propertyController.addProperty);
  }
}

export const propertyRoutes = new PropertyRoutes();

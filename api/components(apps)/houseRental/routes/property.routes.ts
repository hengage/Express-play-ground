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
    this.router.route("/").post(propertyController.addProperty);
    this.router.route("/:propertyId").patch(propertyController.updateProperty);
  }
}

export const propertyRoutes = new PropertyRoutes();

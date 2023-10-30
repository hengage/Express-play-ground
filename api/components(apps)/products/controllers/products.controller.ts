import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { productsService } from "../services/products.service";
import { Shop, } from "../../shops";
import { jwtUtils } from "../../../utils";

class ProductsController {
  public async addProducts(req: Request, res: Response) {
    try {
      const user = jwtUtils.verifyToken(req) as { _id: string };

      const vendorShop = await Shop.findOne({
        _id: req.params.shopId,
        vendor: user._id,
      });

      if (! vendorShop) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          message: "Failed to create shop",
          error: "Unauthorized access. You do not own this shop",
        });
      }

      const product = await productsService.addProducts(
        req.body,
        user._id,
        req.params.shopId
      );
      res.status(STATUS_CODES.CREATED).json({
        message: "Added product",
        data: product,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to add product",
        error: error.message,
      });
    }
  }
}

export const productsController = new ProductsController();
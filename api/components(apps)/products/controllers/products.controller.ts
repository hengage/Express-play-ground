import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { productsService } from "../services/products.service";
import { Shop } from "../../shops";
import { jwtUtils } from "../../../utils";

class ProductsController {
  public async addProducts(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id;
      const vendorShop = await Shop.findOne({
        _id: req.params.shopId,
        vendor: userId,
      });

      if (!vendorShop) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          message: "Failed to create shop",
          error: "Unauthorized access. You do not own this shop",
        });
      }

      const product = await productsService.addProducts(
        req.body,
        userId,
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

  public async getProductById(req: Request, res: Response) {
    try {
      const product = await productsService.getProductById(
        req.params.productId
      );
      res.status(STATUS_CODES.OK).json({
        message: "Fetched product",
        data: {
          product,
        },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to fetch product",
        error: error.message,
      });
    }
  }

  public async getProductsByCategory(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    try {
      const products = await productsService.getProductByCategory(
        req.params.categoryId, page
      );
      res.status(STATUS_CODES.OK).json({
        message: "Fetched product",
        data: {
          products,
        },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to fetch product",
        error: error.message,
      });
    }
  }
}

export const productsController = new ProductsController();

import { Request, Response } from "express";
import { handleErrorResponse } from "../../../utils";
import { adminOpsForProductsService } from "../services/admin.productsService";
import { STATUS_CODES } from "../../../constants";

class AdminOpsForProductsController {
  async getProducts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const products = await adminOpsForProductsService.getProducts(page);
      res.status(STATUS_CODES.OK).json({
        message: "Operation successful",
        data: { products },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const adminOpsForProductsController =
  new AdminOpsForProductsController();

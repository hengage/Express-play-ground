import { Request, Response } from "express"
import { STATUS_CODES } from "../../../constants"
import { productsService } from "../services/products.service"

class ProductsController {
  public async addProducts(req: Request, res: Response){
    try {
    const product = await productsService.addProducts(req.body, req.params.shopId, )
      res.status(STATUS_CODES.CREATED)
      .json({
        message: "Added product",
        data: product
      })
    } catch (error: any) {
        res.status(error.status ||STATUS_CODES.SERVER_ERROR)
        .json({
            message: "Failed to add product",
            error: error.message
        })
    }
  }
}

export const productsController = new ProductsController()
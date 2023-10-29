import { Request, Response } from "express"
import { STATUS_CODES } from "../../../constants"
import { productsService } from "../services/products.service"
import { vendorService } from "../../vendors"
import { shopServices } from "../../shops"

class ProductsController {
  public async addProducts(req: Request, res: Response){
    try {
    await vendorService.getVendorById(req.body.vendorId, '_id')
    await shopServices.getShopById(req.params.shopId, '_id')
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
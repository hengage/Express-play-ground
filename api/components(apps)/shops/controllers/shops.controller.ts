import { Request, Response } from "express";
import { shopServices } from "../services/shops.services";
import { STATUS_CODES } from "../../../constants";

class ShopController {
  public async addcategory(req: Request, res: Response) {
    const { name, description, image } = req.body;
    try {
      const newCategory = await shopServices.addcategory({
        name,
        description,
        image,
      });
      res.status(STATUS_CODES.CREATED).json({
        message: "Added new category",
        data: newCategory,
      });
    } catch (error: any) {
      res
        .status(error.status || STATUS_CODES.SERVER_ERROR)
        .json({ message: "Error creating category", error: error.message });
    }
  }

  public async createShop(req: Request, res: Response) {
    const vendor = req.params.vendorId;
    try {
      const shop = await shopServices.createShop(req.body, vendor);
      res.status(STATUS_CODES.CREATED).json({
        message: "Created shop",
        data: shop,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error creating shop",
        error: error.message,
      });
    }
  }
}

export const shopController = new ShopController();

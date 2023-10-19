import { Request, Response } from "express";
import { shopServices } from "../services/shops.services";
import { STATUS_CODES } from "../../../constants";

class ShopController {
  public async addcategory(req: Request, res: Response) {
    const {name, description, image} = req.body
    try {
      const newCategory = shopServices.addcategory({name, description, image});
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
}

export const shopController = new ShopController();

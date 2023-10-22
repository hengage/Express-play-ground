import { Request, Response } from "express";
import { shopServices } from "../services/shops.services";
import { STATUS_CODES, ShopCategory } from "../../../constants";
import { HandleException } from "../../../utils";

class ShopController {
  public async addcategory(req: Request, res: Response) {
    const { name, image } = req.body;

    try {
      const newCategory = await shopServices.addcategory({
        name,
        image,
      });
      res.status(STATUS_CODES.CREATED).json({
        message: "Added new category",
        data: {
          category: {
            _id: newCategory._id,
            name: newCategory.name,
            image: newCategory.image,
          },
        },
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
      await shopServices.isValidCategoryID(req.body.category);
      const shop = await shopServices.createShop(req.body, vendor);
      res.status(STATUS_CODES.CREATED).json({
        message: "Created shop",
        data: {
          shop: {
            _id: shop._id,
            name: shop.name
          },
        },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error creating shop",
        error: error.message,
      });
    }
  }

  public async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await shopServices.getAllCategories();
      return res.status(STATUS_CODES.OK).json({
        messsage: "Fetched categories",
        data: categories,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "error fetching categories",
        error: error.message,
      });
    }
  }
}

export const shopController = new ShopController();

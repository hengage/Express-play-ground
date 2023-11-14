import { Request, Response } from "express";
import { vendorService } from "../../vendors";
import { STATUS_CODES } from "../../../constants";
import { foodAndGroceryService } from "../services/foodAndGrocery.service";

class FoodAndGroceryController {
  public async addcategory(req: Request, res: Response) {
    const { name, image } = req.body;

    try {
      const newCategory = await foodAndGroceryService.addcategory({
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

  public async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await foodAndGroceryService.getAllCategories();
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

  async createShop(req: Request, res: Response) {
    try {
      const vendorId = (req as any).user._id;
      await vendorService.getVendorById(vendorId, "_id");
      //   await shopServices.isNameTaken(req.body.name)
      const shop = await foodAndGroceryService.createShop(req.body, vendorId);
      res.status(STATUS_CODES.CREATED).json({
        message: "Created shop",
        data: {
          shop: {
            _id: shop._id,
            name: shop.name,
            vendor: shop.vendor,
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
}

export const foodAndGroceryController = new FoodAndGroceryController();

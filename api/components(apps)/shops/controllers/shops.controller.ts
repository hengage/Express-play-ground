import { Request, Response } from "express";
import { shopServices } from "../services/shops.services";
import { STATUS_CODES } from "../../../constants";
import { vendorService } from "../../vendors";

class ShopController {
  public async addcategory(req: Request, res: Response) {
    const { categoryName, categoryImage } = req.body;

    try {
      const newCategory = await shopServices.addcategory({
        categoryName,
        categoryImage,
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

  async createShopType(req: Request, res: Response) {
    try {
      const shopType = await shopServices.createShopType(req.body)
      res.status(STATUS_CODES.CREATED).json({
        message: "Created shop type",
        data: {
          shopType
        }
      })
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR)
      .json({
        message: "Failed to create shop type",
        error: error.message
      })
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

  public async createShop(req: Request, res: Response) {
    try {
      const vendorId = (req as any).user._id
      await vendorService.getVendorById(vendorId, '_id')
      await shopServices.isNameTaken(req.body.name)
      await shopServices.isValidCategoryID(req.body.category);

      const shop = await shopServices.createShop(req.body, vendorId);
      res.status(STATUS_CODES.CREATED).json({
        message: "Created shop",
        data: {
          shop: {
            _id: shop._id,
            name: shop.name,
            vendor: shop.vendor
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

  
  public async getProductsForAshop(req: Request, res: Response) {
    const { shopId } = req.params;
    try {
      const products = await shopServices.getProductsForAShop(
        req.params.shopId
      );
      res.status(STATUS_CODES.OK).json({
        message: `Fetched products for shop: ${shopId}`,
        data: {
          products,
        },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to fetch products",
        error: error.message
      })
    }
  }
}

export const shopController = new ShopController();

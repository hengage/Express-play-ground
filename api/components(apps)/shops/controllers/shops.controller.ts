import { Request, Response } from "express";
import { shopServices } from "../services/shops.services";
import { STATUS_CODES } from "../../../constants";
import { vendorService } from "../../vendors";

class ShopController {
  async getShopTypes(req: Request, res: Response) {
    try {
      const shopTypes = await shopServices.getShopTypes();
      res.status(STATUS_CODES.OK).json({
        message: "Fetched shop types",
        data: shopTypes,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to fetch shop types",
        error: error.message,
      });
    }
  }

  async getCategoriesByShopType(req: Request, res: Response) {
    const { shopTypeId } = req.params;
    try {
      const categories = await shopServices.getCategoriesByShopType(shopTypeId);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched categories for shop type: " + shopTypeId,
        data: categories,
      });
    } catch (error) {}
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
      const vendorId = (req as any).user._id;
      await vendorService.getVendorById(vendorId, "_id");
      await shopServices.isNameTaken(req.body.name);
      await shopServices.isValidCategoryID(req.body.category);

      const shop = await shopServices.createShop(req.body, vendorId);
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

  public async updateShop(req: Request, res: Response) {
    const vendorId = (req as any).user._id;
    try {
      const shop = await shopServices.updateShop(
        req.params.shopId,
        vendorId,
        req.body
      );
      res.status(STATUS_CODES.OK).json({
        message: "Updated shop",
        data: shop,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error updating shop",
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
        error: error.message,
      });
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const orders = await shopServices.getOrders(req.params.shopId);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched orders",
        data: orders,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error getting orders",
        error: error.message,
      });
    }
  }

  async deleteShop(req: Request, res: Response) {
    try {
      await shopServices.deleteShop(req.params.shopId);
      res.status(STATUS_CODES.OK).json({
        message: "Shop deleted successfully",
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error deleting shop",
        error: error.message,
      });
    }
  }

  async getFoodAndGroceryShops(req: Request, res: Response) {
    const page = parseInt((req.query.page as string)) || 1
    try {
      const shops = await shopServices.getFoodAndGroceryShops(page)
      res.status(STATUS_CODES.OK).json({
        message: "Successful",
        data: {shops}
      })
    } catch (error: any) {
       res.status(error.status | STATUS_CODES.SERVER_ERROR)
       .json({
        message: "error fetching shops",
        error: error.message
       })
    }
  }
}

export const shopController = new ShopController();

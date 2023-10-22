import { STATUS_CODES, URL_LINKS } from "../../../constants";
import { HandleException } from "../../../utils";
import {
  IAddCategory,
  ICategory,
  ICreateShop,
  IShop,
} from "../interfaces/shops.interface";
import { Category } from "../models/shops.models";
import { Shop } from "../models/shops.models";

class ShopServices {
  public async addcategory(payload: IAddCategory) {
    try {
      const newCategory = new Category({
        name: payload.name,
        image: payload.image,
      });

      const savedCategory = await newCategory.save();
      return savedCategory;
    } catch (error: any) {
      throw new HandleException(STATUS_CODES.SERVER_ERROR, error.message);
    }
  }

  public async createShop(
    payload: ICreateShop,
    vendor: string
  ): Promise<IShop> {
    const logo = payload.logo || URL_LINKS.DEFAULT_SHOP_LOGO;
    try {
      const newShop = new Shop({
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        vendor,
        address: {
          street: payload.street,
          city: payload.city,
          state: payload.state,
          country: payload.country,
          postalCode: payload.postalCode,
        },
        category: payload.category,
        logo: logo,
      });
      const savedShop = await newShop.save();
      return savedShop;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async isValidCategoryID(categoryID: string): Promise<boolean> {
    try {
      const category = await Category.findById(categoryID).select("_id");
      if (category) {
        return true;
      }
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Category not found");
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getAllCategories(): Promise<ICategory[] | string> {
    try {
      const categories = await Category.find({});
      if (categories.length < 1) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          "There are no categories available"
        );
      }
      return categories;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async isNameTaken(name: string): Promise<boolean> {
    try {
      const shop = await Shop.findOne({ name }).select("name");
      if (shop) {
        throw new HandleException(
          STATUS_CODES.CONFLICT,
          "Name is not available"
        );
      }
      return false;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const shopServices = new ShopServices();

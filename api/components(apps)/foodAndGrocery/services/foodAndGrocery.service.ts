import { STATUS_CODES, URL_LINKS } from "../../../constants";
import { HandleException } from "../../../utils";
import { IAddCategory, ICategory } from "../../shops";
import { FoodAndGroceryCategory, FoodAndGroceryShop } from "../models/foodAndGrocery.models";

class FoodAndGroceryService {
  public async addcategory(payload: IAddCategory) {
    try {
      const newCategory = new FoodAndGroceryCategory({
        name: payload.name,
        image: payload.image,
      });

      const savedCategory = await newCategory.save();
      return savedCategory;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getAllCategories(): Promise<ICategory[] | string> {
    try {
      const categories = await FoodAndGroceryCategory.find({});
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

  public async createShop(payload: any, vendor: string) {
    const logo = payload.logo || URL_LINKS.DEFAULT_SHOP_LOGO;
    try {
      const newShop = new FoodAndGroceryShop({
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
}

export const foodAndGroceryService = new FoodAndGroceryService();
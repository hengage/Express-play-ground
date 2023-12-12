import { HandleException } from "../../../utils";
import { Shop } from "../models/shops.models";

class ShopRepository {
  async getFoodAndGroceryShops() {
    try {
      const shops = await Shop.find({ type: "43c89847" })
        .select("name logo location.coordinates")
        .lean()
        .exec();
      return shops;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const shopRepository = new ShopRepository();

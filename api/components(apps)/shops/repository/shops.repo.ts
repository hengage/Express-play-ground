import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Shop } from "../models/shops.models";

class ShopRepository {
  async getFoodAndGroceryShops(page: number) {
    try {
      const query = { type: "43c89847" };
      const options = {
        page,
        limit: 8,
        select: "name logo location.coordinates",
        lean: true,
        leanWithId: false,
        sort: { createdAt: 1 },
      };

      const shops = await Shop.paginate(query, options);
      return shops;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async deleteShopsForAVendor(vendorId: string) {
    await Shop.deleteMany({ vendor: vendorId });
  }
}

export const shopRepository = new ShopRepository();

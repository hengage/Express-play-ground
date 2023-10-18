import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Category } from "../models/shops.models";

class ShopServices {
    public async addcategory (payload: any) {
        try {
            const newCategory = new Category({
                name: payload.name,
                description: payload.description,
                image: payload.image
            })

            const savedCategory = await newCategory.save();
            return savedCategory
        } catch (error: any) {
            throw new HandleException(STATUS_CODES.SERVER_ERROR, error.message);
        }
    }
}

export const shopServices = new ShopServices();
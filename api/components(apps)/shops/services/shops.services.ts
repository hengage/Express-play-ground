import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { IAddCategory } from "../interfaces/shops.interface";
import { Category } from "../models/shops.models";

class ShopServices {
    public async addcategory (payload: IAddCategory) {
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
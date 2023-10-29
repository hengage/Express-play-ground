import { HandleException } from "../../../utils";
import { Product } from "../models/products.mode";

class ProductsService {
  public async addProducts(payload: any, shopId: string) {
    try {
      const product = new Product({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        photos: payload.photos,
        sizes: payload.sizes,
        colors: payload.colors,
        shop: shopId,
        vendor: payload.vendorId,
      });
      await product.save();
      return product
    } catch (error: any) {
        throw new HandleException(error.status, error.message)
    }
  }
}

export const productsService = new ProductsService()
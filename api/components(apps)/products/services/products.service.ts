import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Product } from "../models/products.model";
import { IAddProduct, IProduct } from "../products.interface";

class ProductsService {
  public async addProducts(
    payload: IAddProduct,
    vendorId: string,
    shopId: string
  ) {
    try {
      const product = new Product({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        photos: payload.photos,
        sizes: payload.sizes,
        colors: payload.colors,
        shop: shopId,
        vendor: vendorId,
      });
      await product.save();
      return product;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getProductsForAShop(shopId: string): Promise<IProduct[]> {
    try {
      const products = await Product.find({ shop: shopId }).select(
        "_id name photos price"
      ).lean();
      if (products.length < 1) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          "This shop has no item"
        );
      }
      return products;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const productsService = new ProductsService();

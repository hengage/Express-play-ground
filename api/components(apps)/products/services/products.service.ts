import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Shop } from "../../shops";
import { Product } from "../models/products.model";
import { IAddProduct, IProduct } from "../products.interface";

class ProductsService {
  public async addProducts(
    payload: IAddProduct,
    vendorId: string,
    shopId: string
  ) {
    try {
      const shop = await Shop.findById(shopId).select("category").lean().exec();

      if (!shop) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Shop not found");
      }

      if (!shop.category) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          "Shop does not have a category"
        );
      }

      const product = new Product({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        photos: payload.photos,
        sizes: payload.sizes,
        colors: payload.colors,
        shop: shopId,
        category: shop.category,
        vendor: vendorId,
      });
      await product.save();
      return product;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getProductById(productId: string): Promise<IProduct> {
    try {
      const product = await Product.findById({ _id: productId }).select(
        "_id name description photos price"
      );

      if (!product) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Product not found");
      }
      return product;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getProductByCategory(
    categoryId: string,
    page: number,
    limit: number = 20
  ): Promise<IProduct[]> {
    const skip = (page - 1) * limit;

    try {
      const products = await Product.find({ category: categoryId })
        .select("_id name description photos price")
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

        return products;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }
}

export const productsService = new ProductsService();

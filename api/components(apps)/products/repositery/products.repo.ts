import { HandleException } from "../../../utils";
import { Product } from "../models/products.model";

async function deleteProduct(shopId: string) {
  try {
    await Product.deleteMany({ shop: shopId });
    console.log("Deleted products for shop", shopId);
  } catch (error: any) {
    throw new HandleException(error.status, error.message);
  }
}

export { deleteProduct };
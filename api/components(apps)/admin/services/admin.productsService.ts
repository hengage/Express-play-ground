import { Product } from "../../products";

class AdminOpsForProductsService {
  async getProducts(page: number) {
    const query = {};

    const options = {
      page,
      limit: 20,
      select: "name price createdAt",
      populate: [{ path: "category", select: "name" }],
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const products = await Product.paginate(query, options);
    return products;
  }
}

export const adminOpsForProductsService = new AdminOpsForProductsService();

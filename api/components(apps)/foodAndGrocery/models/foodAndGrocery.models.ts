import { Schema, model } from "mongoose";
import { IFoodAndGroceryCategory, IFoodAndGroceryShop } from "../foodAndGrocery.interface";
import { categorySchema, shopSchema } from "../../shops";



const foodAndGroceryShopSchema = new Schema<IFoodAndGroceryShop>(shopSchema.obj, {
  timestamps: true,
});

export const FoodAndGroceryShop = model<IFoodAndGroceryShop>(
  "FoodAndGrocery",
  foodAndGroceryShopSchema
);


const foodAndGroceryCategorySchema = new Schema<IFoodAndGroceryShop>(categorySchema.obj, {
  timestamps: true,
});
// Create the FoodAndGrocery model based on the foodAndGrocerySchema
export const FoodAndGroceryCategory = model<IFoodAndGroceryCategory>(
  "FoodAndGroceryCategory",
  foodAndGroceryCategorySchema
);



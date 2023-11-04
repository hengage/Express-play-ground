import { HandleException } from "../../../utils";
import { Order } from "../models/orders.models";

class OrdersService {
    public async createOrder(payload: any) {
        try {
            const orderItems = payload.items.map((item: any) => {
                return {
                  product: item.product,
                  quantity: item.quantity,
                  price: item.price,
                  shop: item.shop, 
                };
              });
        
            const order = new Order({
                customer: payload.customer,
                items: orderItems,
                totalAmount: payload.totalAmount
            })

            await order.save()
            return order
        } catch (error: any) {
            throw new HandleException(error.status, error.message)
        }
    }
}

export const ordersService = new OrdersService()
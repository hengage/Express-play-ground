import { Request, Response } from "express";
import { ordersService } from "../services/orders.service";
import { STATUS_CODES } from "../../../constants";

class OrdersController  {
    async createOrder(req: Request, res: Response) {
        try {
            const customerId = (req as any).user._id;
            console.log({customer: customerId})
            const order = await ordersService.createOrder(req.body, customerId)
            res.status(STATUS_CODES.OK).json({
                message: "Created order",
                data: {
                    order
                }
            })
        } catch (error: any) {
            res.status(error.status || STATUS_CODES.SERVER_ERROR)
            .json({
                message: "Failed to create order",
                error: error.message
            })
        }
    }
}

export const ordersController = new OrdersController()
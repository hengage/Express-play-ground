import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import { STATUS_CODES } from "../../../constants";

class AdminController {
    public async deliveryRate(req: Request, res: Response) {
        try {
        const deliveryRate = await adminService.deliveryRate(req.body)
        res.status(STATUS_CODES.CREATED).json({
            message: "Operation succesful",
            data: deliveryRate
        })
        } catch (error: any) {
            res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
                message: "Operation failed",
                error: error.message
            })
        }
    }
}

export const adminController = new AdminController()
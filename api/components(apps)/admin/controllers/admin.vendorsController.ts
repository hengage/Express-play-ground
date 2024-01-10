import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { adminOpsForVendorsService } from "../services/admin.vendorsService";

class AdminOpsForVendorsController {
  async getVendors(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    try {
        const vendors = await adminOpsForVendorsService.getVendors(page)
        res.status(STATUS_CODES.OK).json({
            messsge: "Found vendors",
            data: {vendors}
        })
    } catch (error: any) {
        res.status(error.status || STATUS_CODES.SERVER_ERROR)
        .json({
            message: "Operation failed",
            error: error.message || "Server error"
        })
    }
  }
}

export const adminOpsForVendorsController = new AdminOpsForVendorsController();

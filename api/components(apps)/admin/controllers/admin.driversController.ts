import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { adminDriversService } from "../services/admin.drivers.service";

class AdminDriversController {
  async getDrivers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const drivers = await adminDriversService.getDrivers(page);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched drivers",
        data: { drivers },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error getting drivers",
        error: error.message || "Server error",
      });
    }
  }
}

export const adminDriversController = new AdminDriversController()

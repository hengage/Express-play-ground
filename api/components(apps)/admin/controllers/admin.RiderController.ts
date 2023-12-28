import { Request, Response } from "express";
import { adminRidersService } from "../services/admin.ridersService";
import { STATUS_CODES } from "../../../constants";

class AdminRidersController {
    async getRiders(req: Request, res: Response) {
      const page = parseInt(req.query.page as string) || 1;
      try {
        const riders = await adminRidersService.getRiders(page);
        res.status(STATUS_CODES.OK).json({
          message: "Fetched riders",
          data: { riders },
        });
      } catch (error: any) {
        res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
          message: "Error getting riders",
          error: error.message || "Server error",
        });
      }
    }
  
    async getRiderById(req: Request, res: Response) {
      try {
        const rider = await adminRidersService.getRiderById(req.params.riderId);
        res.status(STATUS_CODES.OK).json({
          message: "Fetched rider",
          data: { rider },
        });
      } catch (error: any) {
        res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
          message: "Error getting rider",
          error: error.message || "Server error",
        });
      }
    }
  }
  
  export const adminRidersController = new AdminRidersController();
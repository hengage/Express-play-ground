import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { transportRepo } from "../repository/transport.repo";
import { towingRepo } from "../repository/towing.repo";
import { handleErrorResponse } from "../../../utils";
import { towingService } from "../services/towing.service";

class TowingController {
  async createTowOrder(req: Request, res: Response) {
    try {
      const towOrder = await towingRepo.createOrder(req.body);
      res.status(STATUS_CODES.CREATED).json({
        message: "Created tow order",
        data: { towOrder },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getTowingServiceVehicleTypes(req: Request, res: Response) {
    try {
      const vehicleTypes =
        await towingService.getTowingServiceVehicleTypes();
      res.status(STATUS_CODES.OK).json({
        message: "Found vehicle types",
        data: { vehicleTypes },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }


  async getOrdersHistoryForCompany(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const companyId = (req as any).user._id;

      const towOrders = await towingRepo.getOrdersHistoryForCompany(
        companyId,
        page
      );
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: { towOrders },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getOrderdetails(req: Request, res: Response) {
    try {
      const towOrder = await towingRepo.getOrderDetails(req.params.orderId);
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: { towOrder },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const towingController = new TowingController();
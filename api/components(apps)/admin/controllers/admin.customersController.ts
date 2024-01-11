import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { adminOpsForCustomersService } from "../services/admin.customersServices";

class AdminOpsForCustomersController {
  async getCustomers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const customers = await adminOpsForCustomersService.getCustomers(page);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched customers",
        data: { customers },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to fetch customers",
        error: error.message || "Server error",
      });
    }
  }

  async getCustomerDetails(req: Request, res: Response) {
    try {
      const customer = await adminOpsForCustomersService.getCustomerDetails(
        req.params.customerId
      );
      res.status(STATUS_CODES.OK).json({
        message: "Fetched customer",
        data: { customer },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to get customer",
        error: error.message || "Server error",
      });
    }
  }
}

export const adminOpsForCustomersController =
  new AdminOpsForCustomersController();

import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { adminTransportService } from "../services/admin.transport.services";

class AdminTransportServiceController {
  async getServiceTypes(req: Request, res: Response) {
    try {
      const serviceTypes = await adminTransportService.getServiceTypes();
      res.status(STATUS_CODES.OK).json({
        message: "Fetched service types",
        data: { serviceTypes },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Operation failed",
        error: error.message || "Server error",
      });
    }
  }
}

export const adminTransportServiceController = new AdminTransportServiceController()
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

  async getVehiclesByServiceType(req: Request, res: Response) {
    const { serviceTypeId } = req.params;
    try {
      const vehicleTypes = await adminTransportService.getVehiclesByServiceType(
        `${serviceTypeId}`
      );
      res.status(STATUS_CODES.OK).json({
        message: "Found vehicle types",
        data: { vehicleTypes },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Operation failed",
        error: error.message || "Server error",
      });
    }
  }

  async getCompanies(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;

    try {
      const transportCompanies =
        await adminTransportService.getTransportCompanies(page);
      res.status(STATUS_CODES.OK).json({
        message: "Found companies",
        data: { transportCompanies },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Operation failed",
        error: error.message || "Server error",
      });
    }
  }

  async getCompanyDetails(req: Request, res: Response) {
    try {
      const company = await adminTransportService.getCompanyDetails(
        req.params.companyId
      );
      res.status(STATUS_CODES.OK).json({
        message: "Fetched company details",
        data: { company },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Operation failed",
        error: error.message || "Server error",
      });
    }
  }

  async addAirport(req: Request, res: Response) {
    try {
      const airport = await adminTransportService.addAirport(req.body);
      res.status(STATUS_CODES.OK).json({
        message: "Airport added",
        data: { airport },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to add airport",
        error: error.message || "Server error",
      });
    }
  }

  async getAllAirports(req: Request, res: Response) {
    try {
      const airports = await adminTransportService.getAllAirports();
      res.status(STATUS_CODES.OK).json({
        message: "Fetched airports",
        data: { airports },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed fetch airports",
        error: error.message || "Server error",
      });
    }
  }
}

export const adminTransportServiceController =
  new AdminTransportServiceController();

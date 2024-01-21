import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { adminOpsForVendorsService } from "../services/admin.vendorsService";

class AdminOpsForVendorsController {
  async getVendors(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const vendors = await adminOpsForVendorsService.getVendors(page);
      res.status(STATUS_CODES.OK).json({
        messsge: "Found vendors",
        data: { vendors },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Operation failed",
        error: error.message || "Server error",
      });
    }
  }

  async getVendorDetails(req: Request, res: Response) {
    try {
      const vendor = await adminOpsForVendorsService.getVendorDetails(
        req.params.vendorId
      );
      res.status(STATUS_CODES.OK).json({
        message: "Fetched driver",
        data: { vendor },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to get vendor",
        error: error.message || "Server error",
      });
    }
  }

  async getUnapprovedVendors(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const vendors = await adminOpsForVendorsService.getUnapprovedVendors(page);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched vendors",
        data: { vendors },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Operation Failed",
        error: error.message || "Server error",
      });
    }
  }

  async approveVendor(req: Request, res: Response) {
    try {
      await adminOpsForVendorsService.approveVendor(req.params.vendorId);
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Operation Failed",
        error: error.message || "Server error",
      });
    }
  }
}

export const adminOpsForVendorsController = new AdminOpsForVendorsController();

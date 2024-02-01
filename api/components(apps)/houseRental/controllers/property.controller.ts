import { Request, Response } from "express";
import { handleErrorResponse } from "../../../utils";
import { propertyRepo } from "../repository/property.repo";
import { STATUS_CODES } from "../../../constants";

class PropertyController {
  async addProperty(req: Request, res: Response) {
    const landlord = (req as any).user;

    try {
      const property = await propertyRepo.addProperty(req.body, landlord._id);
      res.status(STATUS_CODES.CREATED).json({
        message: "success",
        data: { property },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async updateProperty(req: Request, res: Response) {
    const landlord = (req as any).user;
    try {
      const property = await propertyRepo.updateProperty(
        landlord._id,
        req.params.propertyId,
        req.body
      );
      res.status(STATUS_CODES.OK).json({
        message: "success",
        data: { property },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const propertyController = new PropertyController();

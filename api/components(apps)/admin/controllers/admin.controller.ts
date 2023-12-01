import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import { STATUS_CODES } from "../../../constants";

class AdminController {
   public  async createShopType(req: Request, res: Response) {
        try {
          const shopType = await adminService.createShopType(req.body);
          res.status(STATUS_CODES.CREATED).json({
            message: "Created shop type",
            data: {
              _id: shopType._id,
            },
          });
        } catch (error: any) {
          res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
            message: "Failed to create shop type",
            error: error.message,
          });
        }
      }

      public async addcategory(req: Request, res: Response) {
        const { shopTypeId } = req.params;
        const { categoryName, categoryImage } = req.body;
    
        try {
          const newCategory = await adminService.addcategory({
            categoryName,
            categoryImage,
            shopTypeId,
          });
          res.status(STATUS_CODES.CREATED).json({
            message: "Added new category",
            data: {
              category: {
                _id: newCategory._id,
                name: newCategory.name,
                image: newCategory.image,
              },
            },
          });
        } catch (error: any) {
          res
            .status(error.status || STATUS_CODES.SERVER_ERROR)
            .json({ message: "Error creating category", error: error.message });
        }
      }
  public async deliveryRate(req: Request, res: Response) {
    try {
      const deliveryRate = await adminService.deliveryRate(req.body);
      res.status(STATUS_CODES.CREATED).json({
        message: "Operation succesful",
        data: deliveryRate,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Operation failed",
        error: error.message,
      });
    }
  }

  public async createVehicleType(req: Request, res: Response) {
    try {
      const vehicleType = await adminService.createVehicleType(req.body);
      res.status(STATUS_CODES.CREATED).json({
        message: "Operation successful",
        data: vehicleType,
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Operation failed",
        error: error.message,
      });
    }
  }

  public async updateVehicleType(req: Request, res: Response) {
    try {
      const vehicleType = await adminService.updateVehicleType(
        req.params.vehicleTypeId,
        req.body
      );
      res.status(STATUS_CODES.OK).json({
        message: "Operation successful",
        data: vehicleType
      })
    } catch (error: any) {
        res.status(error.status || STATUS_CODES.SERVER_ERROR)
        .json({
            message: "Operation failed",
            error: error.message
        })
    }
  }
}

export const adminController = new AdminController();

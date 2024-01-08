import { Request, Response } from "express";
import { transportService } from "../services/transport.service";
import { STATUS_CODES } from "../../../constants";
import { jwtUtils } from "../../../utils";
import { transportRepo } from "../repository/transport.repo";

class TransportController {
  async create(req: Request, res: Response) {
    try {
      const transportCompany = await transportService.create(req.body);
      res.status(STATUS_CODES.OK).json({
        message: "Created towing company",
        data: { transportCompany },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error creating towing company",
        error: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const transportCompany = await transportService.login(req.body);
      const payload = {
        _id: transportCompany._id,
        phoneNumber: transportCompany.phoneNumber,
      };
      const accessToken = jwtUtils.generateToken(payload, "1h");
      const refreshToken = jwtUtils.generateToken(payload, "14d");

      res.status(STATUS_CODES.OK).json({
        message: "Logged in",
        data: {
          _id: transportCompany._id,
          accessToken,
          refreshToken,
        },
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: "Failed to login",
        error: error.message,
      });
    }
  }

  async addVehicle(req: Request, res: Response) {
    const { vehicle } = req.body;
    const towingCompanyId = (req as any).user._id;
    try {
      await transportService.addVehicle({ vehicle }, towingCompanyId);
      res.status(STATUS_CODES.OK).json({
        message: "Added vehicle type",
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error adding vehicle type",
        error: error.message,
      });
    }
  }

  async addDriver(req: Request, res: Response) {
    const transportCompanyId = (req as any).user._id;
    try {
      const driver = await transportService.addDriver(
        req.body,
        transportCompanyId
      );
      res.status(STATUS_CODES.CREATED).json({
        message: "Added driver",
        data: { driver },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error adding driver",
        error: error.message,
      });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const _id = (req as any).user._id;
      const transportCompny = await transportService.getMe(_id);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched profile",
        data: {
          transportCompny,
        },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error fetching profile",
        error: error.message || "Server error",
      });
    }
  }

  async updateProfile(req: Request, res: Response) {
    const id = (req as any).user._id;
    try {
      const transportCompany = await transportRepo.updateProfile(id, req.body);
      res.status(STATUS_CODES.OK).json({
        message: "Updated profile",
        data: { transportCompany },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to update profile",
        error: error.message,
      });
    }
  }

  async getVehiclesByServiceType(req: Request, res: Response) {
    const { serviceTypeId } = req.params;
    try {
      const vehicleTypes = await transportService.getVehiclesByServiceType(
        `${serviceTypeId}`
      );
      res.status(STATUS_CODES.OK).json({
        message: "Found vehicle types",
        data: { vehicleTypes },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "failed to fetch vehicle types",
      });
    }
  }

  async getTowingServiceVehicleTypes(req: Request, res: Response) {
    try {
      const vehicleTypes =
        await transportService.getTowingServiceVehicleTypes();
      res.status(STATUS_CODES.OK).json({
        message: "Found vehicle types",
        data: { vehicleTypes },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "failed to fetch vehicle types",
      });
    }
  }

  async getServiceTypes(req: Request, res: Response) {
    try {
      const serviceTypes = await transportService.getServiceTypes();
      res.status(STATUS_CODES.OK).json({
        message: "Fetched service types",
        data: { serviceTypes },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Failed to fetch service types",
        error: error.message || "Server error",
      });
    }
  }

  async getTransportCompanyDrivers(req: Request, res: Response) {
    const id = (req as any).user._id;
    try {
      const drivers = await transportService.getTransportCompanyDrivers(id);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched drivers",
        data: { drivers },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error on fetching drivers",
        erorr: error.message || "Server error",
      });
    }
  }

  async getTransportCompanyDriver(req: Request, res: Response) {
    try {
      const id = (req as any).user._id;
      const driver = await transportService.getTransportCompanyDriver(
        id,
        req.params.driverId
      );
      res.status(STATUS_CODES.OK).json({
        message: "Fetched driver",
        data: { driver },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error on getting driver",
        erorr: error.message || "Server error",
      });
    }
  }

  async updateDriver(req: Request, res: Response) {
    const transportCompanyId = (req as any).user._id;
    try {
      const driver = await transportRepo.updateDriver(
        req.params.driverId,
        transportCompanyId,
        req.body
      );
      res.status(STATUS_CODES.OK).json({
        message: "Updated driver",
        data: { driver },
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error updating driver",
        error: error.message || "Server error",
      });
    }
  }

  async deleteDriver(req: Request, res: Response) {
    const transportCompanyId = (req as any).user._id;
    try {
      await transportRepo.deleteDriver(req.params.driverId, transportCompanyId);
      res
        .status(STATUS_CODES.OK)
        .json({ message: "Driver deleted successfully" });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Error deleting driver",
        error: error.message || "Server error",
      });
    }
  }
}

export const transportController = new TransportController();

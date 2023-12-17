import { Request, Response } from "express";
import { towingService } from "../services/towing.service";
import { STATUS_CODES } from "../../../constants";
import { ReferSip } from "twilio/lib/twiml/VoiceResponse";

class TowingController {
    async create(req: Request, res: Response) {
        try {
            const towingCompany = await towingService.create(req.body)
            res.status(STATUS_CODES.OK)
            .json({
                message: "Created towing company",
                data: {towingCompany}
            })
        } catch (error: any) {
            res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
                message: "Error creating towing company",
                error:  error.message
            })
        }       
    }
}

export const towingController = new TowingController();
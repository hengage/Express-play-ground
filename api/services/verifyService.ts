// verifyService.ts
import { Twilio } from "twilio";
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_VERIFY_SID,
} from "../config/secrets.config";
import { Request, Response } from "express";
import { STATUS_CODES } from "../constants";
import { HandleException } from "../utils";

class VerifyService {
  private twilioClient: Twilio;
  private verifyServiceSID: string; // Your Verify Service SID

  constructor() {
    this.twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    this.verifyServiceSID = `${TWILIO_VERIFY_SID}`;
    console.log({servicesid: this.verifyServiceSID})
  }

  sendVerificationCode = async (req: Request, res: Response) => {
    const { recipientPhoneNumber } = req.body;
    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.verifyServiceSID)
        .verifications.create({
          to: recipientPhoneNumber,
          channel: "sms", // You can change this to 'whatsapp' for WhatsApp verification
        });
      console.log(`Verification code sent: ${verification.sid}`);
      //   return verification;
      res.status(STATUS_CODES.OK).json({
        message: "Verification code sent",
        data: verification,
      });
    } catch (error: any) {
      console.error(`Failed to send verification code: ${error}`);
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "operation failed",
        errror: error.message,
      });
    }
  };

  checkVerificationCode = async (req: Request, res: Response) => {
    const { recipientPhoneNumber, otpCode } = req.body;
    try {
      const verificationCheck = await this.twilioClient.verify.v2
        .services(this.verifyServiceSID)
        .verificationChecks.create({
          to: recipientPhoneNumber,
          code: otpCode,
        });
      if (verificationCheck.status === "approved") {
        console.log("Verification code is valid.");
        res.status(STATUS_CODES.OK).json({
          message: "Verification successful",
        });
      } else {
        console.log("Verification code is not valid.");
        throw new HandleException(
          STATUS_CODES.BAD_REQUEST,
          "Inavlid code"
        );
      }
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "operation failed",
        errror: error.message,
      });
    }
  };
}

export const verifyService = new VerifyService();

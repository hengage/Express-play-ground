import { Twilio } from "twilio";
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} from "../config/secrets.config";

class SmsService {
  private twilioClient: Twilio;

  constructor() {
    this.twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  async sendSms(to: string, message: string) {
    console.log({ to });
    try {
      const response = await this.twilioClient.messages.create({
        body: message,
        from: `${TWILIO_PHONE_NUMBER}`,
        to,
      });
      console.log(`SMS sent with SID: ${response.sid}`);
      return response;
    } catch (error) {
      console.error(`Failed to send SMS: ${error}`);
    }
  }
}

export const smsService = new SmsService();

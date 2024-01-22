import axios from "axios";
import { PAYSTACK_API_KEY } from "../../../config";
import { HandleException } from "../../../utils";

class TransactionService {
  private paystackAPIKey: string;
  private headers: Record<string, string>;
  constructor() {
    this.paystackAPIKey = `${PAYSTACK_API_KEY}`;
    this.headers = {
      Authorization: `Bearer ${this.paystackAPIKey}`,
    };
  }
  async verifyPayment(payload: any) {
    const { reference } = payload;
    console.log(reference);

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: this.headers,
        }
      );

      if (response.data.data.status === "success") {
        console.log("Verified transaction", response.data);
      } else {
        console.log(`Payment failed. Status: ${response}`);
      }
    } catch (error: any) {
      const errorResponse = error.response;
      throw new HandleException(errorResponse.status, errorResponse.data);
    }
  }
}

export const transactionService = new TransactionService();

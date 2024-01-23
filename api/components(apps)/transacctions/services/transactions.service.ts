import axios from "axios";
import { PAYSTACK_API_KEY } from "../../../config";
import { HandleException } from "../../../utils";
import { walletService } from "../../wallet";

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

      //   console.log({responseData: response.data})
      if (response.data.data.status === "success") {
        // console.log("Verified transaction", response.data);
        const responseData = response.data.data;
        console.log({ responseData });
        var { amount } = responseData;
        amount = amount / 100;
        const { receiverId, customerId, description } = responseData.metadata;

        walletService.recordEarningsAndCreditWallet({
          receiverId,
          customerId,
          reference,
          description,
          amount,
        });
        console.log({ receiverId, customerId, description, amount, reference });
      } else {
        console.log(`Payment failed. Status: ${response.data}`);
      }
    } catch (error: any) {
      const errorResponse = error.response;
      throw new HandleException(errorResponse.status, errorResponse.data);
    }
  }
}

export const transactionService = new TransactionService();

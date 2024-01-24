import { Request, Response } from "express";
import { walletRepo } from "../repository/wallet.repo";
import { STATUS_CODES } from "../../../constants";
import { handleErrorResponse } from "../../../utils";

class WalletController {
  async addWithDrawalDetails(req: Request, res: Response) {
    try {
      const user = (req as any).user._id;
      const withdrawalDetails = await walletRepo.addWithdrawalDetails(
        user,
        req.body
      );
      res.status(STATUS_CODES.OK).json({
        message: "Success",
        data: withdrawalDetails,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const walletController = new WalletController();

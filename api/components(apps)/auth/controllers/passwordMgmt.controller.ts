import { Request, Response } from "express";
import { passwordMgmtService } from "../services/passwordMgmt.services";
import { STATUS_CODES } from "../../../constants";

class PasswordMgmtController {
  public async resetPassword(req: Request, res: Response) {
    const accountType = req.query.accountType as string;
    try {
      await passwordMgmtService.resetPassword(
        req.body.phoneNumber,
        req.body.newPassword,
        accountType.toLowerCase()
      );
      res
        .status(STATUS_CODES.OK)
        .json({ message: "Password reset successful" });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Password reset failed",
        error: error.message,
      });
    }
  }

  public async changePassword(req: Request, res: Response) {
    const accountType = req.query.accountType as string;
    try {
      await passwordMgmtService.changePassword(
        req.params.accountId,
        req.body.currentPassword,
        req.body.newPassword,
        accountType.toLowerCase()
      );
      res.status(STATUS_CODES.OK).json({
        message: "Password changed",
      });
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Password change failed",
        error: error.message,
      });
    }
  }
}

export const passwordMgmtController = new PasswordMgmtController();

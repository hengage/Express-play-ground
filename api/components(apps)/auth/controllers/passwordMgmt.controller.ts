import { Request, Response } from "express";
import { passwordMgmtService } from "../services/passwordMgmt.services";
import { STATUS_CODES } from "../../../constants";

class PasswordMgmtController {
  public async resetPassword(req: Request, res: Response) {
    const userType = req.query.usertype as string;
    try {
      await passwordMgmtService.resetPassword(
        req.body.phoneNumber,
        req.body.newPassword,
        userType.toLowerCase()
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
    const userType = req.query.usertype as string;
    const { userId, newPassword } = req.body;
    try {
      await passwordMgmtService.changePassword(userId, newPassword, userType);
      res.status(STATUS_CODES.OK).json({
        message: "Password changed"
      })
    } catch (error: any) {
      res.status(error.status || STATUS_CODES.SERVER_ERROR).json({
        message: "Password chnage failed",
        error: error.message,
      });
    }
  }
}

export const passwordMgmtController = new PasswordMgmtController();

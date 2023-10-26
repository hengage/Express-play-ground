import { Request, Response } from "express";
import { passwordMgmtService } from "../services/passwordMgmt.services";
import { STATUS_CODES } from "../../../constants";

class PasswordMgmtController {
  public async resetPassword(req: Request, res: Response) {
    const  userType   = req.query.usertype as string;
    console.log({userType })
    try {
      await passwordMgmtService.resetPassword(
        req.body.phoneNumber,
        req.body.newPassword,
        userType.toLowerCase()
      );
      res.status(STATUS_CODES.SERVER_ERROR)
      .json({message: "Password reset successful"})
    } catch (error: any ) {
        res.status(error.status|| STATUS_CODES.SERVER_ERROR)
        .json({
            message: "Password reset failed",
            error: error.message
        })
    }
  }
}

export const passwordMgmtController = new PasswordMgmtController();

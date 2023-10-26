import { Router } from "express";
import { verifyController } from "../controllers/verify.controller";
import { passwordMgmtController } from "../controllers/passwordMgmt.controller";


class AuthRoutes  {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router
      .route('/verify/phone-number/send-code')
      .post(verifyController.sendVerificationCode);
  
      this.router
      .route('/verify/phone-number/check-code')
      .post(verifyController.checkVerificationCode);

      this.router
      .route('/password/reset')
      .patch(passwordMgmtController.resetPassword);
  }
}

export const authRoutes = new AuthRoutes();

import { NextFunction, Request, Response } from "express";
import { jwtUtils } from "../utils";

class AuthMiddleware {
  public isUserAuthorized(req: Request, res: Response, next: NextFunction) {
    const decodedUser = jwtUtils.verifyToken(req);
    // if (typeof decodedUser === 'object' && '_id' in decodedUser) {
    if (
      typeof decodedUser !== "string" &&
      decodedUser._id === req.params.vendorId
    ) {
      next();
      return;
    }
    //   }
    return res
      .status(403)
      .json({ message: "You are not authorized to access this resource" });
  }
}

export const authMiddleware = new AuthMiddleware();

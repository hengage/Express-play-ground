import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { HandleException } from "../utils";
import { SECRET_KEY } from "../config/secrets.config";
import { STATUS_CODES } from "../constants";

class JWT {
  public generateToken(payload: any, expiresIn: string): string {
    return jwt.sign(payload, `${SECRET_KEY}`, { expiresIn });
  }

  public verifyToken(req: Request) {
    const token = req.headers.authorization?.split(" ")[1] || req.body.token;

    if (!token) {
      throw new HandleException(401, "Token not provided");
    }

    try {
      const decoded = jwt.verify(token, `${SECRET_KEY}`);
      return decoded;
    } catch (error: any) {
      throw new HandleException(401, error.message);
    }
  }

  verifyTokenMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers.authorization?.split(" ")[1] || req.body.token;

    if (!token) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, `${SECRET_KEY}`);
      console.log({decoded});
      (req as any).user = decoded;
      next();
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  };
}

export const jwtUtils = new JWT();
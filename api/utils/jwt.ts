import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { HandleException } from "../utils";
import { SECRET_KEY } from "../config/secrets.config";

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
}

export const jwtUtils = new JWT;
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import env from "../config/env.config";
import { Database } from "../database";
import { User } from "../entity/User";

interface RequestCustom extends Request {
  user: User;
}

export class AuthMiddleware {
  public static async verifyToken(
    req: RequestCustom,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "Unauthorized!" });
    const token = authHeader.split("Bearer ")[1];
    if (!token) return res.status(401).json({ msg: "Unauthorized!" });
    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      const user = await Database.userRepository.findOne({ id: decoded.id });
      delete user.password;
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Unauthorized!" });
    }
  }
}


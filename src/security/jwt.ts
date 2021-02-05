import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { v4 as uuidv4 } from "uuid";
import { RefreshToken } from "../entity/RefreshToken";
import * as moment from "moment";
import { Database } from "../database";
import env from "../config/env.config";

export class JWT {
  public static JWT_SECRET = env.jwtSecret;
  public static async generateTokenAndRefreshToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const jwtId = uuidv4();
    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: "5h",
      jwtid: jwtId,
      subject: user.id.toString(),
    });
    const refreshToken = await this.generateRefreshTokenForUserAndToken(
      user,
      jwtId
    );
    return { token, refreshToken };
  }

  public static async generateRefreshTokenForUserAndToken(
    user: User,
    jwtId: string
  ) {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.jwtId = jwtId;
    refreshToken.expiryDate = moment().add(10, "d").toDate();
    await Database.refreshTokenRepository.save(refreshToken);

    return refreshToken.id;
  }

  public static isTokenValid(token: string) {
    try {
      jwt.verify(token, this.JWT_SECRET, {
        ignoreExpiration: false,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  public static getJwtId(token: string) {
    const decodedToken = jwt.decode(token);
    return decodedToken["jti"];
  }

  public static async isRefreshTokenLinkedToToken(
    refreshToken: RefreshToken,
    jwtId: string
  ) {
    if (!refreshToken) return false;
    if (refreshToken.jwtId !== jwtId) return false;
    return true;
  }

  public static async isRefreshTokenExpired(refreshToken: RefreshToken) {
    if (!refreshToken) throw new Error("Refresh token does not exist!");

    if (moment().isAfter(refreshToken.expiryDate)) return true;

    return false;
  }

  public static async isRefreshTokenUsedOrInvalidated(
    refreshToken: RefreshToken
  ) {
    return refreshToken.used || refreshToken.invalidated;
  }

  public static getJwtPayloadValueByKey(token: string, key: string) {
    const decodedToken = jwt.decode(token);
    return decodedToken[key];
  }
}

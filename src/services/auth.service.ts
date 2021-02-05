import * as bcrypt from "bcrypt";
import { Database } from "../database";
import { AuthDTO } from "../dto/auth.dto";
import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import { UserDTO, UserRole } from "../dto/user.dto";
import { User } from "../entity/User";
import { JWT } from "../security/jwt";
import { PasswordHash } from "../security/passwordHash";
import { EntityToDTO } from "../utils/entity-to-dto";
import { UserService } from "./user.service";

export class AuthService {
  public static async validateForLogin(
    email: string,
    passwd: string
  ): Promise<any> {
    if (!email && !passwd) throw new Error("Email and password required!");
    const user = await UserService.findByEmail(email);
    if (!user || !(await PasswordHash.isPasswordValid(passwd, user.password)))
      throw new Error("User not found with these credentials!");

    delete user.password;

    return await this.getTokenAndRefreshToken(user);
  }

  public static async validateForRegister(body: UserDTO): Promise<any> {
    const user = await UserService.findByEmailOrUsername(
      body.email,
      body.username
    );
    if (user) throw new Error("User with these credentials already exist!");
    const hashedPassword = await PasswordHash.hashPassword(body.password);
    const newUser = new UserDTO();
    newUser.email = body.email;
    newUser.name = body.name;
    newUser.password = hashedPassword;
    newUser.username = body.username;
    newUser.role = UserRole.USER;
    const createdUser = await UserService.create(newUser);
    delete createdUser.password;

    return await this.getTokenAndRefreshToken(createdUser);
  }

  private static async getTokenAndRefreshToken(user: User): Promise<AuthDTO> {
    const jwtResult = await JWT.generateTokenAndRefreshToken(user);
    const authDto: AuthDTO = new AuthDTO();
    authDto.token = jwtResult.token;
    authDto.refresh_token = jwtResult.refreshToken;
    authDto.user = user;
    return authDto;
  }

  public static async validateForRefreshToken(
    body: RefreshTokenDTO
  ): Promise<AuthDTO> {
    // check if the jwt token is valid & has not expired
    if (!JWT.isTokenValid(body.token)) throw new Error("Jwt token is invalid!");
    const jwtId = JWT.getJwtId(body.token);

    const user = await Database.userRepository.findOne(
      JWT.getJwtPayloadValueByKey(body.token, "id")
    );

    // check if user eixsts
    if (!user) throw new Error("User does not exist!");

    // fetch refresh token from db
    const refreshToken = await Database.refreshTokenRepository.findOne(
      body.refreshToken
    );

    // check if the refresh token does exist and was linked to this jwt token
    if (!(await JWT.isRefreshTokenLinkedToToken(refreshToken, jwtId)))
      throw new Error("Token and refresh token mismatch!");

    // check if the refresh token has expired
    if (await JWT.isRefreshTokenExpired(refreshToken))
      throw new Error("Refresh token has expired!");

    // check if the refresh token was used or was invalidated
    if (await JWT.isRefreshTokenUsedOrInvalidated(refreshToken))
      throw new Error("Refresh token has been used or invalidated!");

    refreshToken.used = true;
    await Database.refreshTokenRepository.save(refreshToken);

    // generate a fresh pair token and refresh token
    const tokenResults = await JWT.generateTokenAndRefreshToken(user);

    const authenticationDTO: AuthDTO = new AuthDTO();
    const userDTO: UserDTO = EntityToDTO.userToDTO(user);
    authenticationDTO.user = userDTO;
    authenticationDTO.token = tokenResults.token;
    authenticationDTO.refresh_token = tokenResults.refreshToken;
    return authenticationDTO;
  }
}

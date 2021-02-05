import * as express from "express";
import { Request, Response } from "express";
import { Database } from "../database";
import { AuthDTO } from "../dto/auth.dto";
import { LoginDTO } from "../dto/login.dto";
import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import { UserDTO } from "../dto/user.dto";
import { JWT } from "../security/jwt";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { EntityToDTO } from "../utils/entity-to-dto";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const body: LoginDTO = req.body;
    const payload = await AuthService.validateForLogin(
      body.email,
      body.password
    );
    res.status(200).json(payload);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const body: UserDTO = req.body;
    const payload = await AuthService.validateForRegister(body);
    res.status(200).json(payload);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

router.post("/refresh/token", async (req: Request, res: Response) => {
  try {
    const body: RefreshTokenDTO = req.body;
    const authDto: AuthDTO = await AuthService.validateForRefreshToken(body);

    res.status(200).json(authDto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

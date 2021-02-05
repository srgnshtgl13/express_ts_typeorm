import * as express from "express";
import { Request, Response } from "express";
import { AuthMiddleware } from "../security/auth.middleware";
import { UserService } from "../services/user.service";

const router = express.Router();

router.get(
  "/",
  AuthMiddleware.verifyToken,
  async function (req: any, res: Response) {
    const users = await UserService.findAll();
    res.send(users);
  }
);

router.get("/:id", async function (req: Request, res: Response) {
  const user = await UserService.findById(+req.params.id);
  res.status(200).json(user);
});

router.post("/", function (req: Request, res: Response) {
  res.send("create user");
});

router.put("/:id", function (req: Request, res: Response) {
  res.send("update user by id");
});

router.delete("/:id", function (req: Request, res: Response) {
  res.send("delete user by id");
});

export default router;

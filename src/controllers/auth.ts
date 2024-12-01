import { Request, Response } from "express";
import AuthService from "../services/auth";

export default class AuthController {
  static registration = async (req: Request, res: Response) => {
    const { userName, email, password } = req.body as {
      email: string;
      password: string;
      userName: string;
    };

    const newUser = await AuthService.registration({
      email,
      password,
      userName,
    });

    res.send(newUser);
  };
  static login = async (req: Request, res: Response) => {
    const { email } = req.body as {
      email: string;
    };

    const { accessToken, refreshToken } = await AuthService.login({ email });

    res.cookie("refreshToken", refreshToken);
    res.cookie("accessToken", accessToken);

    res.send();
  };
  static refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const { newAccessToken, newRefreshToken } = await AuthService.refreshToken(
      refreshToken
    );

    res.cookie("refreshToken", newRefreshToken);
    res.cookie("accessToken", newAccessToken);

    res.send();
  };
}

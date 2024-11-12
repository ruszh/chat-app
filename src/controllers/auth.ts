import { Request, Response } from "express";
import { Token } from "../entity/token.entity";
import { User } from "../entity/user.entity";
import { dataSource } from "../app-data-source";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";

export default class AuthController {
  static registration = async (req: Request, res: Response) => {
    const { userName, email, password } = req.body as {
      email: string;
      password: string;
      userName: string;
    };

    const userRepository = dataSource.getRepository(User);

    const existedUser = await userRepository.findOne({
      where: { email },
    });

    if (existedUser) {
      res.status(409).send("User with this email already exists");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = userRepository.create({
      userName,
      email,
      password: hashedPassword,
    });

    const result = await userRepository.save(newUser);

    res.send(result);
  };
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const userRepository = dataSource.getRepository(User);
    const tokenRepository = dataSource.getRepository(Token);

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      res.status(404).send("Authentication failed");
      return;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      res.status(404).send("Authentication failed");
      return;
    }

    const accessToken = generateAccessToken({ email, id: user.id });

    const refreshToken = generateRefreshToken();

    const newToken = tokenRepository.create({
      refreshToken,
      user,
    });

    await tokenRepository.save(newToken);

    res.send({ refreshToken, accessToken });
  };
  static refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body as { refreshToken: string };
    const tokenRepository = dataSource.getRepository(Token);

    const token = await tokenRepository.findOne({
      where: { refreshToken },
      relations: ["user"],
    });

    if (!token) {
      res.status(404).send("Authentication failed");
      return;
    }

    const { email, id } = token.user;

    const newAccessToken = generateAccessToken({ email, id });

    const newRefreshToken = generateRefreshToken();

    const newToken = tokenRepository.create({
      refreshToken: newRefreshToken,
      user: token.user,
    });

    await tokenRepository.save(newToken);
    await tokenRepository.remove(token);

    res.send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  };
}

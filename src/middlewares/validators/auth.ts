import { NextFunction, Response, Request } from "express";
import bcrypt from "bcrypt";
import { userRepository, tokenRepository } from "../../lib/repositories";

export const registrationValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }

  const existedUser = await userRepository.findOne({
    where: { email },
  });

  if (existedUser) {
    res.status(409).send("User with this email already exists");
    return;
  }

  next();
};

export const loginValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }

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

  next();
};

export const refreshTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;

  const token = await tokenRepository.findOne({
    where: { refreshToken },
    relations: ["user"],
  });

  if (!refreshToken || !token) {
    res.status(404).send("Authentication failed");
    return;
  }

  next();
};

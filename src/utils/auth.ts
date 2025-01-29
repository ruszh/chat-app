import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { User } from "../types";

export const generateAccessToken = (user?: User | null) => {
  const newUser = { ...user };

  delete newUser.password;
  delete newUser.createdAt;

  return jwt.sign(newUser, process.env.JWT_TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = () => nanoid(48);

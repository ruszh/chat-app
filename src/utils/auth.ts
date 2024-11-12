import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { AuthUserData, RequestWithUser } from "../types";

export const generateAccessToken = (data: { email: string; id: string }) =>
  jwt.sign(data, process.env.JWT_TOKEN_SECRET as string, {
    expiresIn: "1h",
  });

export const generateRefreshToken = () => nanoid(48);

export const getRequestUserData = (req: RequestWithUser) =>
  req.user as AuthUserData;

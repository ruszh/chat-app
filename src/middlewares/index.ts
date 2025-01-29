import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../types";

const port = process.env.PORT || 3000;

// CORS middleware
export const allowCrossDomain = (
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  res.header(`Access-Control-Allow-Origin`, `http://localhost:${port}`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    res.status(401).json({ error: "Access denied" });
  }

  try {
    const decodedTokenData = jwt.verify(
      accessToken,
      process.env.JWT_TOKEN_SECRET as string
    );

    req.user = decodedTokenData as User;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

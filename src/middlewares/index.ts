import { NextFunction, Response, Request } from "express";
import { port } from "../constants";
import jwt from "jsonwebtoken";
import { AuthUserData, RequestWithUser } from "../types";

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
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ error: "Access denied" });
  }

  try {
    const decodedTokenData = jwt.verify(
      token?.split(" ")?.[1] || "",
      process.env.JWT_TOKEN_SECRET as string
    );

    (req as RequestWithUser).user = decodedTokenData as AuthUserData;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

import { Request } from "express";

export type AuthUserData = { email: string; id: string };

export type RequestWithUser = Request & { user?: AuthUserData };

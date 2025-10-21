import type { NextFunction, Request, Response } from "express";

declare module "express-serve-static-core" {
  interface Request {
    agent: string;
  }
}

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.agent = "lodging" as const;
  next();
};

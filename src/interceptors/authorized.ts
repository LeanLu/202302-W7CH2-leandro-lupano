import { NextFunction, Response } from 'express';
import { RequestPlus } from './logged.js';

export function authorized(
  req: RequestPlus,
  resp: Response,
  next: NextFunction
) {
  try {
    next();
  } catch (error) {
    next(error);
  }
}

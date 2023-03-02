import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';
import { HTTPError } from '../errors/errors.js';

export interface TokenPayload extends jwt.JwtPayload {
  id: string;
  email: string;
  role: string;
}

const salt = 10;

export class Auth {
  static createJWT(payload: TokenPayload) {
    return jwt.sign(payload, config.jwtSecret as string);
  }

  static verifyJWT(token: string): TokenPayload {
    const result = jwt.verify(token, config.jwtSecret as string);

    if (typeof result === 'string')
      throw new HTTPError(498, 'Invalid Token', result);

    return result as TokenPayload;
  }

  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}

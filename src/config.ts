import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

export const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  cluster: process.env.DB_CLUSTER,
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.SECRET,
};

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

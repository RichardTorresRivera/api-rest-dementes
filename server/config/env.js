import dotenv from "dotenv";

dotenv.config();

export const DB_URL = process.env.DB_URL;
export const PORT = process.env.PORT;
export const JWT = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
};
export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);

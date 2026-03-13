import dotenv from "dotenv";

dotenv.config();

export const DB_URL = process.env.DB_URL;
export const PORT = process.env.PORT;
export const DB_NAME = process.env.DB_NAME;
export const DB_BASE_URL = process.env.DB_BASE_URL;

import dotenv from 'dotenv';

// load env variables from .env file
dotenv.config();

export const PORT = process.env.PORT;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret_key';
export const DATABASE_URL = process.env.DATABASE_URL;
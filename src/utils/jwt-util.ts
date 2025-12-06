import jwt from "jsonwebtoken";
import { CustomerJWTPayload } from "../models/customer.model";
import { StringValue } from "ms";
import { JWT_SECRET_KEY } from "./env-util";

export const generateToken = (
  payload: CustomerJWTPayload,
  expiryTime: StringValue = "1h"
): string => {
  return jwt.sign(payload, JWT_SECRET_KEY || "secret_key", {
    expiresIn: expiryTime,
  });
};

export const verifyToken = (token: string): CustomerJWTPayload => {
  return jwt.verify(token, JWT_SECRET_KEY || "secret_key") as CustomerJWTPayload;
};
import { Customer } from "../../generated/prisma/client";

// JWT payload for authentication
export interface CustomerJWTPayload {
  id: number;
  name: string;
  phoneNumber: string;
}

// REQ interfaces
export interface CreateCustomerDTO {
  name: string;
  phoneNumber: string;
}

export interface UpdateCustomerNameDTO {
  name: string;
}

export interface UpdateCustomerPhoneDTO {
  phoneNumber: string;
}

// RES interfaces
export interface CustomerResponse {
  id: number;
  name: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerType = Customer;
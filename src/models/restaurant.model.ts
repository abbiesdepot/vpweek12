import { Restaurant } from "../../generated/prisma/client";

export interface CreateRestaurantDTO {
  name: string;
  description?: string;
  isOpen?: boolean;
}

export interface UpdateRestaurantNameDTO {
  name: string;
}

export interface UpdateRestaurantDescriptionDTO {
  description?: string;
}

export interface UpdateRestaurantStatusDTO {
  isOpen: boolean;
}

export interface RestaurantResponse {
  id: number;
  name: string;
  description: string | null;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RestaurantType = Restaurant;

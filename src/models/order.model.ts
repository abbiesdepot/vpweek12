import { Order } from "../../generated/prisma/client";

export interface CreateOrderDTO {
  customerId: number;
  restaurantId: number;
  orderDetails: string;
  itemCount: number;
}

export interface OrderResponse {
  id: number;
  orderDetails: string;
  itemCount: number;
  estimatedArrival: number;
  orderedAt: Date;
  customerId: number;
  restaurantId: number;
}

export type OrderType = Order;

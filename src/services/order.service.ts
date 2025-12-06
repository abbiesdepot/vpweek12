import { prismaClient } from "../utils/database-util";
import { CreateOrderDTO } from "../models/order.model";

export class OrderService {
  // func to calculate ETA
  private calculateETA(itemCount: number): number {
    return (itemCount * 10) + 10; // 10 min per item + 10 min delivery
  }

  // newordder
  async createOrder(data: CreateOrderDTO) {
    return await prismaClient.order.create({
      data: {
        customerId: data.customerId,
        restaurantId: data.restaurantId,
        orderdetails: data.orderDetails,
        itemcount: data.itemCount
      },
      include: {
        customer: true,
        restaurant: true
      }
    });
  }

  // get all orders
  async getAllOrders() {
    return await prismaClient.order.findMany({
      include: {
        customer: true,
        restaurant: true
      },
      orderBy: {
        orderat: 'desc'
      }
    });
  }

  // get order by ID
  async getOrderById(id: number) {
    return await prismaClient.order.findUnique({
      where: { id },
      include: {
        customer: true,
        restaurant: true
      }
    });
  }

  // get orders by customer
  async getOrdersByCustomer(customerId: number) {
    const customer = await prismaClient.customer.findUnique({
      where: { id: customerId }
    });

    const orders = await prismaClient.order.findMany({
      where: { customerId },
      include: {
        customer: true,
        restaurant: true
      },
      orderBy: {
        orderat: 'desc'
      }
    });

    return { customer, orders };
  }

  // get orders by restaurant
  async getOrdersByRestaurant(restaurantId: number) {
    const restaurant = await prismaClient.restaurant.findUnique({
      where: { id: restaurantId }
    });

    const orders = await prismaClient.order.findMany({
      where: { restaurantId },
      include: {
        customer: true,
        restaurant: true
      },
      orderBy: {
        orderat: 'desc'
      }
    });

    return { restaurant, orders };
  }

  // delete order
  async deleteOrder(id: number) {
    return await prismaClient.order.delete({
      where: { id }
    });
  }
}
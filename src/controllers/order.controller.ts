import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { orderCreateSchema } from '../validators/schemas';

const orderService = new OrderService();

export class OrderController {
  // POST CREATE order
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      // merge query and body so POSTs using query params or body bisa -> zod will validate either
      const source: any = { ...(req.query || {}), ...(req.body && Object.keys(req.body).length ? req.body : {}) };
      const parsed = orderCreateSchema.safeParse(source);
      if (!parsed.success) return res.status(400).json({ error: 'Invalid request', issues: parsed.error.format() });

      const order = await orderService.createOrder({
        customerId: Number(parsed.data.customerId),
        restaurantId: Number(parsed.data.restaurantId),
        orderDetails: parsed.data.orderDetails,
        itemCount: Number(parsed.data.itemCount)
      });

      res.status(201).json({
        message: 'Order created successfully',
        data: {
          ...order,
          estimatedArrivalMessage: `${(order.itemcount * 10) + 10} minutes`
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET orders
  static async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getAllOrders();

      res.json({
        message: 'Orders retrieved successfully',
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  // GET ID order
  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(Number(id));

      if (!order) {
        return res.status(404).json({ 
          error: 'Order not found' 
        });
      }

      res.json({
        message: 'Order retrieved successfully',
        data: {
          ...order,
          orderInfo: {
            orderedAt: order.orderat,
            itemCount: order.itemcount,
            estimatedArrival: `${(order.itemcount * 10) + 10} minutes`,
            orderDetails: order.orderdetails
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET orders by customer
  static async getOrdersByCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerId } = req.params;
      const result = await orderService.getOrdersByCustomer(Number(customerId));

      res.json({
        message: `Orders for ${result.customer?.name} retrieved successfully`,
        count: result.orders.length,
        customer: result.customer,
        data: result.orders
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/orders/restaurant/:restaurantId - Get orders by restaurant
  static async getOrdersByRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const { restaurantId } = req.params;
      const result = await orderService.getOrdersByRestaurant(Number(restaurantId));

      res.json({
        message: `Orders from ${result.restaurant?.name} retrieved successfully`,
        count: result.orders.length,
        restaurant: result.restaurant,
        data: result.orders
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE 
  static async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await orderService.deleteOrder(Number(id));

      res.json({
        message: 'Order deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
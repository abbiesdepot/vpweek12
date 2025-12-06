import { Request, Response, NextFunction } from 'express';
import { RestaurantService } from '../services/restaurant.service';
import { restaurantCreateSchema, restaurantNameSchema, restaurantDescriptionSchema, restaurantStatusSchema } from '../validators/schemas';

const restaurantService = new RestaurantService();

export class RestaurantController {
  // POST CREATE restaurant
  static async createRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      // merge query and body so POSTs using query params or body bisa -> zod will validate either
      const source: any = { ...(req.query || {}), ...(req.body && Object.keys(req.body).length ? req.body : {}) };
      const { name, description, isOpen } = source;

      if (!name) {
        return res.status(400).json({ 
          error: 'Restaurant name is required' 
        });
      }

      const parsed = restaurantCreateSchema.safeParse({ name, description, isOpen });
      if (!parsed.success) return res.status(400).json({ error: 'Invalid request', issues: parsed.error.format() });
      // build payload with properties provided to satisfy strict types
      const createPayload: any = { name: parsed.data.name };
      if (parsed.data.description !== undefined) createPayload.description = parsed.data.description;
      if (parsed.data.isOpen !== undefined) createPayload.isOpen = parsed.data.isOpen;
      const restaurant = await restaurantService.createRestaurant(createPayload);

      res.status(201).json({
        message: 'Restaurant created successfully',
        data: restaurant
      });
    } catch (error) {
      next(error);
    }
  }

  // GET restaurants
  static async getAllRestaurants(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurants = await restaurantService.getAllRestaurants();

      res.json({
        message: 'Restaurants retrieved successfully',
        count: restaurants.length,
        data: restaurants
      });
    } catch (error) {
      next(error);
    }
  }

  // GET ID restaurant
  static async getRestaurantById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurant = await restaurantService.getRestaurantById(Number(id));

      if (!restaurant) {
        return res.status(404).json({ 
          error: 'Restaurant not found' 
        });
      }

      res.json({
        message: 'Restaurant retrieved successfully',
        data: restaurant
      });
    } catch (error) {
      next(error);
    }
  }

  // GET restaurants by status
  static async getRestaurantsByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.params;
      const isOpen = (status || '').toLowerCase() === 'open';

      const restaurants = await restaurantService.getRestaurantsByStatus(isOpen);

      res.json({
        message: `${status} restaurants retrieved successfully`,
        count: restaurants.length,
        data: restaurants
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH update restaurant name
  static async updateRestaurantName(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const source: any = { ...(req.query || {}), ...(req.body && Object.keys(req.body).length ? req.body : {}) };
      const { name } = source;

      if (!name) {
        return res.status(400).json({ 
          error: 'Restaurant name is required' 
        });
      }

      const restaurant = await restaurantService.updateRestaurantName(Number(id), { name });

      res.json({
        message: 'Restaurant name updated successfully',
        data: restaurant
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH update restaurant description
  static async updateRestaurantDescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const source: any = { ...(req.query || {}), ...(req.body && Object.keys(req.body).length ? req.body : {}) };
      const { description } = source;

      const parsed = restaurantDescriptionSchema.safeParse({ description });
      if (!parsed.success) return res.status(400).json({ error: 'Invalid description', issues: parsed.error.format() });
      const updatePayload: any = {};
      if (parsed.data.description !== undefined) updatePayload.description = parsed.data.description;
      const restaurant = await restaurantService.updateRestaurantDescription(Number(id), updatePayload);

      res.json({
        message: 'Restaurant description updated successfully',
        data: restaurant
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH update restaurant status
  static async updateRestaurantStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const source: any = { ...(req.query || {}), ...(req.body && Object.keys(req.body).length ? req.body : {}) };
      const { isOpen } = source;

      const parsed = restaurantStatusSchema.safeParse({ isOpen });
      if (!parsed.success) return res.status(400).json({ error: 'Invalid status', issues: parsed.error.format() });
      const restaurant = await restaurantService.updateRestaurantStatus(Number(id), { isOpen: parsed.data.isOpen });

      res.json({
        message: `Restaurant is now ${isOpen ? 'open' : 'closed'}`,
        data: restaurant
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE restaurant
  static async deleteRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await restaurantService.deleteRestaurant(Number(id));

      res.json({
        message: 'Restaurant deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
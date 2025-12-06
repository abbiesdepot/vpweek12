import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';

const router = Router();

router.post('/', RestaurantController.createRestaurant);

router.get('/', RestaurantController.getAllRestaurants);

router.get('/:id', RestaurantController.getRestaurantById);

router.get('/status/:status', RestaurantController.getRestaurantsByStatus);

router.patch('/:id/name', RestaurantController.updateRestaurantName);

router.patch('/:id/description', RestaurantController.updateRestaurantDescription);

router.patch('/:id/status', RestaurantController.updateRestaurantStatus);

router.delete('/:id', RestaurantController.deleteRestaurant);

export default router;

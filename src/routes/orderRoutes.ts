import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const router = Router();


router.post('/', OrderController.createOrder);


router.get('/', OrderController.getAllOrders);

router.get('/:id', OrderController.getOrderById);

router.get('/customer/:customerId', OrderController.getOrdersByCustomer);

router.get('/restaurant/:restaurantId', OrderController.getOrdersByRestaurant);

export default router;

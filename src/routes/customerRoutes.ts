import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';

const router = Router();

router.post('/', CustomerController.createCustomer);

router.get('/', CustomerController.getAllCustomers);

router.get('/:id', CustomerController.getCustomerById);

router.patch('/:id/name', CustomerController.updateCustomerName);

router.patch('/:id/phone', CustomerController.updateCustomerPhone);

router.delete('/:id', CustomerController.deleteCustomer);

export default router;

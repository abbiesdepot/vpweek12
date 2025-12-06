import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDTO } from '../models/customer.model';
import { customerCreateSchema, customerNameSchema, customerPhoneSchema } from '../validators/schemas';

const customerService = new CustomerService();

export class CustomerController {
  // POST CREATE customer
  static async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      // merge query and body so POSTs using query params or body bisa -> zod will validate either
      const source: any = { ...(req.query || {}), ...(req.body && Object.keys(req.body).length ? req.body : {}) };
      const parsed = customerCreateSchema.safeParse(source); //kalo invalid it will return error, kalo valid it will return data
      if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid request', issues: parsed.error.format() });
      }
      const request: CreateCustomerDTO = parsed.data;

      const customer = await customerService.createCustomer(request); //send valid data to my db function

      res.status(201).json({
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  // GET customers
  static async getAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await customerService.getAllCustomers();

      res.json({
        message: 'Customers retrieved successfully',
        count: customers.length,
        data: customers
      });
    } catch (error) {
      next(error);
    }
  }

  // GET ID customer
  static async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const customer = await customerService.getCustomerById(Number(id));

      if (!customer) {
        return res.status(404).json({ 
          error: 'Customer not found' 
        });
      }

      res.json({
        message: 'Customer retrieved successfully',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH update customer name
  static async updateCustomerName(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const source: any = { ...(req.query || {}), ...(req.body && Object.keys(req.body).length ? req.body : {}) };
      const parsed = customerNameSchema.safeParse({ name: source.name });
      if (!parsed.success) return res.status(400).json({ error: 'Invalid name', issues: parsed.error.format() });
      const customer = await customerService.updateCustomerName(Number(id), { name: parsed.data.name });

      res.json({
        message: 'Customer name updated successfully',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH update phone
  static async updateCustomerPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const source: any = { ...(req.query || {}), ...(req.body && Object.keys(req.body).length ? req.body : {}) };
      const parsed = customerPhoneSchema.safeParse({ phoneNumber: source.phoneNumber });
      if (!parsed.success) return res.status(400).json({ error: 'Invalid phone', issues: parsed.error.format() });
      const customer = await customerService.updateCustomerPhone(Number(id), { phoneNumber: parsed.data.phoneNumber });

      res.json({
        message: 'Customer phone number updated successfully',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE ngedelete customer
  static async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await customerService.deleteCustomer(Number(id));

      res.json({
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
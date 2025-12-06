import express from 'express';
import multer from 'multer';
import { PORT } from './utils/env-util';
import dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import orderRoutes from './routes/orderRoutes';

// loading dr env
dotenv.config();

// make express app
const app = express();

// middleware to understand json
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));

const upload = multer(); //to accept multipart/form-data requests
app.use(upload.none());

// accept any body as text and try to parse JSON when Content-Type is missing
app.use(express.text({ type: '*/*' }));
app.use((req, _res, next) => {
  // if body is a string n not alrdy parsed as an object, try JSON.parse
  if (typeof req.body === 'string') {
    try {
      // attempt parse
      const parsed = JSON.parse(req.body);
      req.body = parsed;
    } catch (e) {
      // biarin, controllers/validators handle invalid payloadsnya
    }
  }
  next();
});

//  inspect incoming requests 
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    // only log for methods that hv bodies
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      console.log('>> Incoming request', {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        bodyType: typeof req.body,
        bodySample: req.body && JSON.stringify(req.body).slice(0, 100)
      });
    }
    next();
  });
}

// test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Order Management API is running!',
    endpoints: {
      customers: '/api/customers',
      restaurants: '/api/restaurants',
      orders: '/api/orders'
    }
  });
});

// conn routes
app.use('/api/customers', customerRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// always return JSON for errors
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  const status = err?.status || 500;
  res.status(status).json({
    error: err?.message || 'Internal Server Error'
  });
});

// start server
app.listen(PORT || 3000, () => {
  console.log(`Connected on http://localhost:${PORT}`);
});
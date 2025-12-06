import { z } from 'zod';

// boolean coercion that handles string "true"/"false" correctly -> basically accepts string trs digantiin ke boolean soalnya pas mbikin kek ada error that its a string n not a boolean so solusinya gini deh
const stringToBoolean = z.union([
  z.boolean(),
  z.string().transform((val) => val.toLowerCase() === 'true')
]);

// customer
export const customerCreateSchema = z.object({
  name: z.string().min(1),
  // creates flexibility for different number formats 
  phoneNumber: z.string().min(1)
    .transform((s) => s.replace(/\D/g, '')) //removes everything but digits
    .refine((digits) => digits.length >= 7 && digits.length <= 15, { message: 'Invalid phone number' }), //length nya 
});

export const customerNameSchema = z.object({ name: z.string().min(1) });
export const customerPhoneSchema = z.object({ phoneNumber: z.string().min(1)
  .transform((s) => s.replace(/\D/g, ''))
  .refine((digits) => digits.length >= 7 && digits.length <= 15, { message: 'Invalid phone number' }) });

// resto 
export const restaurantCreateSchema = z.object({
  name: z.string().min(1), //req
  description: z.string().optional(), //g hrs
  isOpen: stringToBoolean.optional(), // g hrs jg
});

//ini buat update 1 kek dengan aman yk
export const restaurantNameSchema = z.object({ name: z.string().min(1) });
export const restaurantDescriptionSchema = z.object({ description: z.string().optional() });
export const restaurantStatusSchema = z.object({ isOpen: stringToBoolean });

// order
export const orderCreateSchema = z.object({
  // express always reads numbers as strings so validation stuff
  customerId: z.coerce.number().int().positive(),
  restaurantId: z.coerce.number().int().positive(),
  orderDetails: z.string().min(1),
  itemCount: z.coerce.number().int().positive(),
});

export type OrderCreateInput = z.infer<typeof orderCreateSchema>;

import { prismaClient } from './utils/database-util';

async function main() {
  // create customers
  const customers = await Promise.all([
    prismaClient.customer.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: 'Alice', phone: '111-111-1111' } }),
    prismaClient.customer.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: 'Bob', phone: '222-222-2222' } }),
    prismaClient.customer.upsert({ where: { id: 3 }, update: {}, create: { id: 3, name: 'Charlie', phone: '333-333-3333' } }),
  ]);

  // create restaurants
  const restaurants = await Promise.all([
    prismaClient.restaurant.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: 'Pasta Place', description: 'Italian food', isOpen: true } }),
    prismaClient.restaurant.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: 'Burger Barn', description: 'Burgers and fries', isOpen: false } }),
    prismaClient.restaurant.upsert({ where: { id: 3 }, update: {}, create: { id: 3, name: 'Sushi Spot', description: 'Fresh sushi', isOpen: true } }),
  ]);

  // create some orders
  const orders = await Promise.all([
    prismaClient.order.create({ data: { customerId: 1, restaurantId: 1, orderdetails: 'Spaghetti x2', itemcount: 2 } }),
    prismaClient.order.create({ data: { customerId: 1, restaurantId: 3, orderdetails: 'Salmon roll x3', itemcount: 3 } }),
    prismaClient.order.create({ data: { customerId: 2, restaurantId: 2, orderdetails: 'Cheeseburger x1', itemcount: 1 } }),
    prismaClient.order.create({ data: { customerId: 3, restaurantId: 1, orderdetails: 'Lasagna x2', itemcount: 2 } }),
    prismaClient.order.create({ data: { customerId: 3, restaurantId: 3, orderdetails: 'Tuna roll x4', itemcount: 4 } }),
  ]);

  // ensure pivots
  await Promise.all([
    prismaClient.customerRestaurant.upsert({ where: { customerId_restaurantId: { customerId: 1, restaurantId: 1 } }, update: {}, create: { customerId: 1, restaurantId: 1 } }),
    prismaClient.customerRestaurant.upsert({ where: { customerId_restaurantId: { customerId: 1, restaurantId: 3 } }, update: {}, create: { customerId: 1, restaurantId: 3 } }),
    prismaClient.customerRestaurant.upsert({ where: { customerId_restaurantId: { customerId: 2, restaurantId: 2 } }, update: {}, create: { customerId: 2, restaurantId: 2 } }),
    prismaClient.customerRestaurant.upsert({ where: { customerId_restaurantId: { customerId: 3, restaurantId: 1 } }, update: {}, create: { customerId: 3, restaurantId: 1 } }),
    prismaClient.customerRestaurant.upsert({ where: { customerId_restaurantId: { customerId: 3, restaurantId: 3 } }, update: {}, create: { customerId: 3, restaurantId: 3 } }),
  ]);

  console.log('Seeded:', { customers: customers.length, restaurants: restaurants.length, orders: orders.length });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });

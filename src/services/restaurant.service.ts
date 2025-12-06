import { prismaClient } from "../utils/database-util";

export const createRestaurant = async (data: { name: string; description?: string; isOpen?: boolean }) => {
  return prismaClient.restaurant.create({ data: { name: data.name, description: data.description ?? null, isOpen: data.isOpen ?? true } });
};

export const listRestaurants = async (filter?: { isOpen?: boolean }) => {
  const where = filter && typeof filter.isOpen === 'boolean' ? { isOpen: filter.isOpen } : undefined;
  const args: any = { include: { customerRestaurants: { include: { customer: true } }, orders: true } };
  if (where) args.where = where;
  return prismaClient.restaurant.findMany(args);
};

export const getRestaurantById = async (id: number) => {
  return prismaClient.restaurant.findUnique({ where: { id }, include: { customerRestaurants: { include: { customer: true } }, orders: true } });
};

export const updateRestaurantName = async (id: number, name: string) => {
  return prismaClient.restaurant.update({ where: { id }, data: { name } });
};

export const updateRestaurantDescription = async (id: number, description?: string) => {
  return prismaClient.restaurant.update({ where: { id }, data: { description: description ?? null } });
};

export const updateRestaurantStatus = async (id: number, isOpen: boolean) => {
  return prismaClient.restaurant.update({ where: { id }, data: { isOpen } });
};

export const deleteRestaurant = async (id: number) => {
  return prismaClient.restaurant.delete({ where: { id } });
};

export class RestaurantService {
  createRestaurant(data: { name: string; description?: string; isOpen?: boolean }) {
    return createRestaurant(data);
  }

  getAllRestaurants() {
    return listRestaurants();
  }

  getRestaurantById(id: number) {
    return getRestaurantById(id);
  }

  getRestaurantsByStatus(isOpen: boolean) {
    return listRestaurants({ isOpen });
  }

  updateRestaurantName(id: number, payload: { name: string }) {
    return updateRestaurantName(id, payload.name);
  }

  updateRestaurantDescription(id: number, payload: { description?: string }) {
    return updateRestaurantDescription(id, payload.description);
  }

  updateRestaurantStatus(id: number, payload: { isOpen: boolean }) {
    return updateRestaurantStatus(id, payload.isOpen);
  }

  deleteRestaurant(id: number) {
    return deleteRestaurant(id);
  }
}

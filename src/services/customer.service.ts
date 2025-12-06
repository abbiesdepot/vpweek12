import { prismaClient } from "../utils/database-util";

export const createCustomer = async (data: { name: string; phoneNumber: string }) => {
  const customer = await prismaClient.customer.create({
    data: { name: data.name, phone: data.phoneNumber },
  });
  return customer;
};

export const getCustomerById = async (id: number) => {
  return prismaClient.customer.findUnique({
    where: { id },
    include: { orders: true, customerRestaurants: { include: { restaurant: true } } }, //all related customerRestaurants and inside that the linked restaurant
  });
};

export const listCustomers = async () => {
  return prismaClient.customer.findMany({ include: { customerRestaurants: { include: { restaurant: true } } } });
};

export const updateCustomerName = async (id: number, name: string) => {
  return prismaClient.customer.update({ where: { id }, data: { name } });
};

export const updateCustomerPhone = async (id: number, phoneNumber: string) => {
  return prismaClient.customer.update({ where: { id }, data: { phone: phoneNumber } });
};

export const deleteCustomer = async (id: number) => {
  return prismaClient.customer.delete({ where: { id } });
};

//plain func
export class CustomerService {
  createCustomer(data: { name: string; phoneNumber: string }) {
    return createCustomer(data);
  }

  getAllCustomers() {
    return listCustomers();
  }

  getCustomerById(id: number) {
    return getCustomerById(id);
  }

  updateCustomerName(id: number, payload: { name: string }) {
    return updateCustomerName(id, payload.name);
  }

  updateCustomerPhone(id: number, payload: { phoneNumber: string }) {
    return updateCustomerPhone(id, payload.phoneNumber);
  }

  deleteCustomer(id: number) {
    return deleteCustomer(id);
  }
}

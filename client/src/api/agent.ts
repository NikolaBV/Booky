import axios, { type AxiosResponse } from "axios";
import type {
  PurchaseOrder,
  Category,
  Product,
  OrderItem,
  CreateOrderModel,
} from "./models";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

//Middleware
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const orders = {
  list: () => {
    return requests.get<PurchaseOrder[]>("/orders");
  },
  create: (order: CreateOrderModel) => {
    return requests.post<PurchaseOrder>("/orders", order);
  },
  delete: (id: number) => requests.delete(`/orders/${id}`),
  update: (id: number, order: PurchaseOrder) =>
    requests.put(`/orders/${id}`, order),
};

const categories = {
  list: () => requests.get<Category[]>("/category"),
  details: (id: number) => requests.get<Category>(`/category/${id}`),
  create: (category: Partial<Category>) =>
    requests.post<Category>("/category", category),
  update: (id: number, category: Partial<Category>) =>
    requests.put<Category>(`/category/${id}`, category),
  delete: (id: number) => requests.delete(`/category/${id}`),
};

const products = {
  list: () => requests.get<Product[]>("/product"),
  details: (id: number) => requests.get<Product>(`/product/${id}`),
  create: (product: Partial<Product>) =>
    requests.post<Product>("/product", product),
  update: (id: number, product: Partial<Product>) =>
    requests.put<Product>(`/product/${id}`, product),
  delete: (id: number) => requests.delete(`/product/${id}`),
};

const orderItems = {
  list: () => requests.get<OrderItem[]>("/orderitem"),
  details: (id: number) => requests.get<OrderItem>(`/orderitem/${id}`),
  listByOrder: (orderId: number) =>
    requests.get<OrderItem[]>(`/orderitem/order/${orderId}`),
  create: (orderItem: Partial<OrderItem>) =>
    requests.post<OrderItem>("/orderitem", orderItem),
  update: (id: number, orderItem: Partial<OrderItem>) =>
    requests.put<OrderItem>(`/orderitem/${id}`, orderItem),
  delete: (id: number) => requests.delete(`/orderitem/${id}`),
};

const agent = {
  orders,
  categories,
  products,
  orderItems,
};

export default agent;

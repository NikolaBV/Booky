import axios, { type AxiosResponse } from "axios";
import type {
  PurchaseOrder,
  Category,
  Product,
  OrderItem,
  PurchaseOrderDTO,
  RegisterRequest,
  AuthResponse,
  LoginRequest,
  ProductDTO,
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

const auth = {
  register: (registerData: RegisterRequest): Promise<AuthResponse> => {
    return requests.post("/auth/register", registerData);
  },
  login: (loginData: LoginRequest): Promise<AuthResponse> => {
    return requests.post("/auth/login", loginData);
  },
  validateToken: (): Promise<void> => {
    return requests.get("/auth/validate");
  },
  logout: (): void => {
    localStorage.removeItem("token");
  },
};

const orders = {
  list: () => {
    return requests.get<PurchaseOrder[]>("/orders");
  },
  search: (username: string, startDate: Date | null, endDate: Date | null) => {
    const params = new URLSearchParams();
    if (username) params.append("username", username);
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());

    return requests.get<PurchaseOrder[]>(`/orders/search?${params.toString()}`);
  },
  create: (order: PurchaseOrderDTO) => {
    return requests.post<PurchaseOrder>("/orders", order);
  },
  delete: (id: number) => requests.delete(`/orders/${id}`),
  update: (id: number, order: PurchaseOrder) =>
    requests.put(`/orders/${id}`, order),
};

const categories = {
  list: () => requests.get<Category[]>("/category"),
  getById: (id: number) => requests.get<Category>(`/category/${id}`),
  create: (category: Category) =>
    requests.post<Category>("/category", category),
  update: (id: number, category: Category) =>
    requests.put<Category>(`/category/${id}`, category),
  delete: (id: number) => requests.delete(`/category/${id}`),
  search: (searchTerm: string) =>
    requests.get<Category[]>(
      `/category/search?searchTerm=${encodeURIComponent(searchTerm || "")}`
    ),
  searchByName: (name: string) =>
    requests.get<Category[]>(
      `/category/search/name?name=${encodeURIComponent(name || "")}`
    ),
  searchByDescription: (description: string) =>
    requests.get<Category[]>(
      `category/search/description?description=${encodeURIComponent(
        description || ""
      )}`
    ),
};

const products = {
  list: () => requests.get<Product[]>("/product"),
  search: (name: string, categoryId: number | null) => {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (categoryId) params.append("categoryId", categoryId.toString());

    return requests.get<Product[]>(`/product/search?${params.toString()}`);
  },
  details: (id: number) => requests.get<Product>(`/product/${id}`),
  create: (product: Partial<Product>) =>
    requests.post<Product>("/product", product),
  update: (id: number, product: ProductDTO) =>
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
  search: (productName: string, orderId: number | null) => {
    const params = new URLSearchParams();
    if (productName) params.append("productName", productName);
    if (orderId) params.append("orderId", orderId.toString());
    return requests.get<OrderItem[]>(`/orderitem/search?${params.toString()}`);
  },
};

const agent = {
  auth,
  orders,
  categories,
  products,
  orderItems,
};

export default agent;

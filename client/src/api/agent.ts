import axios, { type AxiosResponse } from "axios";
import type { PurchaseOrder } from "./models";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

//Middlewere
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
  delete: (id: number) => requests.delete(`/orders/${id}`),
  update: (id: number, order: PurchaseOrder) =>
    requests.put(`/orders/${id}`, order),
};
const agent = {
  orders,
};

export default agent;

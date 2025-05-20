export interface AppUser {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface PurchaseOrder {
  id: number;
  appUser: AppUser;
  orderDate: Date;
  totalAmount: number;
}
export interface PurchaseOrderDTO {
  appUser: AppUser;
  orderDate: Date;
  totalAmount: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  stockQuantity?: number;
  description?: string;
}

export interface ProductDTO {
  name: string;
  categoryId: number;
  price: number;
  stockQuantity?: number;
  description?: string;
}

export interface OrderItem {
  id: number;
  order: PurchaseOrder;
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderItemDTO {
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

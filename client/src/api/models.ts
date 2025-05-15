export interface AppUser {
  id: number;
  name: string;
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
export interface CreateOrderModel {
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

export interface OrderItem {
  id: number;
  order: PurchaseOrder;
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

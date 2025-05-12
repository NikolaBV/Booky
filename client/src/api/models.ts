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

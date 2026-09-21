import type { Product } from "@/features/products/types/product.types";

export interface OrderAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderRequest {
  items: Array<{ product: string; qty: number; price: number }>;
  totalAmount: number;
  address: OrderAddress;
  paymentId?: string;
}

export interface Order {
  _id: string;
  items: Array<{ product: Product; qty: number; price: number }>;
  totalAmount: number;
  address: OrderAddress;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

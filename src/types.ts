export type UserRole = "buyer" | "seller";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  title: string;
  category: "wet" | "dry" | "treat" | "supplement";
  brand: string;
  size?: string;
  description?: string;
  imageUrl?: string;
  price: number;
  rating: number;
  stock: number;
  seller: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  title: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

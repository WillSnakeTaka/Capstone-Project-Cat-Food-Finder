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

export interface RescueReport {
  id: string;
  catName: string;
  city: string;
  contactName: string;
  contactInfo: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface MusicianPost {
  id: string;
  stageName: string;
  style: string;
  caption: string;
  favoriteTrack: string;
  createdAt: string;
}

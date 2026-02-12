// 1. User Interface (Backend Sync)
export interface User {
  _id: string; // MongoDB use karta hai _id
  fullname: string; // Backend schema me 'fullname' hai
  email: string;
  role: "admin" | "user"; // Mock sync
  createdAt?: string;
  updatedAt?: string;
}

// 2. Product Interface (Backend Sync)
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdBy: string; // User ID (ObjectId as string)
  createdAt: string;
  updatedAt: string;
}

// 3. Auth Response (Controller Sync)
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string; // JWT Token
  user?: User;
}

// 4. Products Response (Controller Sync)
export interface ProductsResponse {
  success: boolean;
  message: string;
  products?: Product[];
  product?: Product;
  cached?: boolean; // Mock caching logic ke liye
}
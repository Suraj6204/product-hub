export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  products?: Product[];
  product?: Product;
  cached?: boolean;
}

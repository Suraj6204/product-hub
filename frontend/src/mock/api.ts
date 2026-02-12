import { AuthResponse, Product, ProductsResponse } from "@/types";
import { mockUsers, mockProducts, getNextProductId } from "./data";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Simple in-memory cache simulation (mimics Redis)
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 30_000; // 30 seconds

function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

function invalidateProductCache() {
  for (const key of cache.keys()) {
    if (key.startsWith("products")) cache.delete(key);
  }
}

// ─── Auth ────────────────────────────────────────────────────

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  await delay();
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (!user) return { success: false, message: "Invalid email or password" };
  const token = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }));
  const { password: _, ...safeUser } = user;
  return { success: true, message: "Login successful", token, user: safeUser };
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
  role: "admin" | "user",
): Promise<AuthResponse> {
  await delay();
  if (mockUsers.find((u) => u.email === email)) {
    return { success: false, message: "Email already registered" };
  }
  const newUser = { id: String(mockUsers.length + 1), name, email, password, role };
  mockUsers.push(newUser);
  const { password: _, ...safeUser } = newUser;
  return { success: true, message: "Registration successful", user: safeUser };
}

// ─── Products ────────────────────────────────────────────────

export async function getAllProducts(): Promise<ProductsResponse> {
  await delay(300);
  const cached = getCache<Product[]>("products:all");
  if (cached) return { success: true, message: "Products fetched (cached)", products: cached, cached: true };
  setCache("products:all", [...mockProducts]);
  return { success: true, message: "Products fetched", products: [...mockProducts], cached: false };
}

export async function getProductById(id: string): Promise<ProductsResponse> {
  await delay(200);
  const cached = getCache<Product>(`products:${id}`);
  if (cached) return { success: true, message: "Product fetched (cached)", product: cached, cached: true };
  const product = mockProducts.find((p) => p.id === id);
  if (!product) return { success: false, message: "Product not found" };
  setCache(`products:${id}`, { ...product });
  return { success: true, message: "Product fetched", product: { ...product }, cached: false };
}

export async function createProduct(
  data: Pick<Product, "name" | "description" | "price" | "category">,
  userId: string,
): Promise<ProductsResponse> {
  await delay(500);
  const product: Product = {
    ...data,
    id: getNextProductId(),
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProducts.push(product);
  invalidateProductCache();
  return { success: true, message: "Product created", product };
}

export async function updateProduct(
  id: string,
  data: Partial<Pick<Product, "name" | "description" | "price" | "category">>,
): Promise<ProductsResponse> {
  await delay(500);
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx === -1) return { success: false, message: "Product not found" };
  mockProducts[idx] = { ...mockProducts[idx], ...data, updatedAt: new Date().toISOString() };
  invalidateProductCache();
  return { success: true, message: "Product updated", product: { ...mockProducts[idx] } };
}

export async function deleteProduct(id: string): Promise<ProductsResponse> {
  await delay(400);
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx === -1) return { success: false, message: "Product not found" };
  mockProducts.splice(idx, 1);
  invalidateProductCache();
  return { success: true, message: "Product deleted" };
}

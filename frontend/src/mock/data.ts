import { User, Product } from "@/types";

export const mockUsers: (User & { password: string })[] = [
  { id: "1", name: "Admin User", email: "admin@example.com", password: "admin123", role: "admin" },
  { id: "2", name: "John Doe", email: "john@example.com", password: "user123", role: "user" },
];

export let mockProducts: Product[] = [
  {
    id: "p1",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    price: 149.99,
    category: "Electronics",
    createdBy: "1",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "p2",
    name: "Leather Backpack",
    description: "Handcrafted genuine leather backpack with laptop compartment.",
    price: 89.99,
    category: "Accessories",
    createdBy: "1",
    createdAt: "2025-01-20T12:00:00Z",
    updatedAt: "2025-01-20T12:00:00Z",
  },
  {
    id: "p3",
    name: "Standing Desk",
    description: "Electric height-adjustable standing desk with memory presets.",
    price: 449.0,
    category: "Furniture",
    createdBy: "1",
    createdAt: "2025-02-01T08:30:00Z",
    updatedAt: "2025-02-01T08:30:00Z",
  },
  {
    id: "p4",
    name: "Organic Coffee Beans",
    description: "Single-origin, fair-trade organic coffee beans — 1kg bag.",
    price: 24.5,
    category: "Food",
    createdBy: "1",
    createdAt: "2025-02-05T14:00:00Z",
    updatedAt: "2025-02-05T14:00:00Z",
  },
  {
    id: "p5",
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with Cherry MX switches.",
    price: 129.0,
    category: "Electronics",
    createdBy: "1",
    createdAt: "2025-02-10T09:15:00Z",
    updatedAt: "2025-02-10T09:15:00Z",
  },
];

let nextProductId = 6;
export const getNextProductId = () => `p${nextProductId++}`;

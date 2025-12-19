import { z } from "zod";

// --- Validations ---

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
const slugSchema = z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens");

// User Schemas
export const UserRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Restaurant Schemas
export const CreateRestaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name is required"),
  restaurantId: slugSchema,
  type: z.string().optional(), // Cafe, Bar, etc.
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

export const UpdateBrandingSchema = z.object({
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  fontFamily: z.string().min(1),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

// Menu Item Schemas
export const MenuItemSchema = z.object({
  name: z.string().min(2, "Item name is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  description: z.string().max(500, "Description is too long").optional(),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal('')),
  isAvailable: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const UpdateMenuItemSchema = MenuItemSchema.partial();

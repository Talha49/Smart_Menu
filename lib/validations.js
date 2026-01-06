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
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").optional(),
  fontFamily: z.string().min(1).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  experienceConfig: z.object({
    layoutID: z.string().optional(),
    motionProfile: z.string().optional(),
    visualDNA: z.object({
      borderRadius: z.coerce.number().min(0).max(50).optional(),
      shadowIntensity: z.string().optional(),
      glassmorphism: z.coerce.number().min(0).max(100).optional(),
    }).optional(),
    seasonalAtmosphere: z.object({
      activeTheme: z.string().optional(),
      intensity: z.coerce.number().min(0).max(100).optional(),
      autoSchedule: z.boolean().optional(),
      schedule: z.array(z.object({
        name: z.string(),
        startMonth: z.number().min(0).max(11),
        endMonth: z.number().min(0).max(11),
        vibe: z.object({
          dna: z.object({ radius: z.string(), glass: z.number(), motion: z.string() }),
          palette: z.object({ primary: z.string(), accent: z.string() }),
          atmosphere: z.object({ active: z.string(), intensity: z.number() })
        })
      })).optional(),
    }).optional(),
    vibeTokens: z.object({
      dna: z.object({
        radius: z.string().optional(),
        glass: z.coerce.number().optional(),
        motion: z.string().optional(),
        glow: z.string().optional(),
      }).optional(),
      palette: z.object({
        primary: z.string().optional(),
        accent: z.string().optional(),
        surface: z.string().optional(),
        background: z.string().optional(),
      }).optional(),
      atmosphere: z.object({
        active: z.string().optional(),
        intensity: z.coerce.number().optional(),
        effects: z.array(z.string()).optional(),
      }).optional(),
    }).optional(),
  }).optional(),
});

export const UpdateBusinessProfileSchema = z.object({
  businessProfile: z.object({
    description: z.string().max(500).optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    whatsapp: z.string().optional().or(z.literal('')),
    socialLinks: z.object({
      instagram: z.string().optional().or(z.literal('')),
      facebook: z.string().optional().or(z.literal('')),
      twitter: z.string().optional().or(z.literal('')),
      _id: z.string().optional(),
    }).optional(),
    openingHours: z.array(z.object({
      day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
      open: z.string().optional().or(z.literal('')),
      close: z.string().optional().or(z.literal('')),
      isClosed: z.boolean().default(false),
      _id: z.string().optional(),
    })).optional(),
  })
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
  isFeatured: z.boolean().default(false),
  // Variants for size options
  variants: z.array(z.object({
    name: z.string().min(1, "Variant name is required"),
    price: z.coerce.number().min(0, "Variant price must be positive"),
    isDefault: z.boolean().default(false),
  })).optional().default([]),
  // Modifiers for add-ons
  modifiers: z.array(z.object({
    name: z.string().min(1, "Modifier name is required"),
    price: z.coerce.number().min(0, "Modifier price must be positive"),
    category: z.string().optional(),
  })).optional().default([]),
});

export const UpdateMenuItemSchema = MenuItemSchema.partial();

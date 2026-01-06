import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a restaurant name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    restaurantId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    logoUrl: { type: String },
    brandColor: { type: String, default: "#4f46e5" }, 
    fontFamily: { type: String, default: "Inter" },
    
    // Grouped Business Profile
    businessProfile: {
        description: { type: String, maxlength: 500, default: "" },
        address: { type: String, default: "" },
        phone: { type: String, default: "" },
        whatsapp: { type: String, default: "" },
        socialLinks: {
            instagram: { type: String, default: "" },
            facebook: { type: String, default: "" },
            twitter: { type: String, default: "" },
        },
        openingHours: [
            {
                day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
                open: { type: String, default: "09:00" },
                close: { type: String, default: "22:00" },
                isClosed: { type: Boolean, default: false },
            }
        ],
    },

    // Next-Gen Branding Engine Configuration
    experienceConfig: {
        layoutID: { type: String, default: "classic-grid" },
        motionProfile: { type: String, default: "liquid" },
        visualDNA: {
            borderRadius: { type: Number, default: 16 },
            shadowIntensity: { type: String, default: "subtle" },
            glassmorphism: { type: Number, default: 0 }, 
        },
        // Vibe Studio: The Global Design Token Store
        vibeTokens: {
            dna: {
                radius: { type: String, default: "1.5rem" },
                glass: { type: Number, default: 20 },
                motion: { type: String, default: "liquid-spring" },
                glow: { type: String, default: "none" }
            },
            palette: {
                primary: { type: String, default: "#4f46e5" },
                accent: { type: String, default: "#f43f5e" },
                surface: { type: String, default: "glass-white" },
                background: { type: String, default: "minimal" }
            },
            atmosphere: {
                active: { type: String, default: "none" },
                intensity: { type: Number, default: 50 },
                effects: { type: [String], default: [] }
            }
        },
        seasonalAtmosphere: {
            activeTheme: { type: String, default: "none" },
            intensity: { type: Number, default: 50 },
            autoSchedule: { type: Boolean, default: false },
            schedule: [
                {
                    name: String,
                    startMonth: Number, // 0-11
                    endMonth: Number, // 0-11
                    vibe: {
                        dna: { radius: String, glass: Number, motion: String },
                        palette: { primary: String, accent: String },
                        atmosphere: { active: String, intensity: Number }
                    }
                }
            ]
        },
    },

    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
  },
  { timestamps: true, minimize: false }
);

// Force delete the model in development to ensure schema changes are picked up
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.Restaurant;
}

export default mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);

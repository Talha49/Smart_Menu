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
      index: true, // Critical for tenant lookup performance
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
    // Branding & Pro Features
    logoUrl: { type: String },
    brandColor: { type: String, default: "#4f46e5" }, // Default primary color
    fontFamily: { type: String, default: "Inter" },
    
    // Payment Info
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);

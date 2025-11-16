import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
      required: true,
    },
    stripeCustomerId: {
      type: String,
      default: '',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    brandColor: {
      type: String,
      default: '#000000',
    },
  },
  { timestamps: true }
);

// Create explicit indexes for performance (multi-tenant optimization)
restaurantSchema.index({ restaurantId: 1 }); // For public menu lookups
restaurantSchema.index({ owner: 1 }); // For user-restaurant queries

export default mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

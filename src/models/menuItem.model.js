import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Uncategorized',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
  },
  { timestamps: true }
);

// Create explicit indexes for performance (multi-tenant optimization)
menuItemSchema.index({ restaurant: 1 }); // Critical for filtering by restaurant
menuItemSchema.index({ restaurant: 1, isAvailable: 1 }); // Compound index for public menu queries
menuItemSchema.index({ restaurant: 1, category: 1 }); // Compound index for category filtering

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

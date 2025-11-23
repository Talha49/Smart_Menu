import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      default: null, // null for default templates, ObjectId for custom templates
    },
    category: {
      type: String,
      enum: ['menu', 'tv', 'both'],
      default: 'both',
    },
  },
  { timestamps: true }
);

// Create indexes for performance
templateSchema.index({ restaurant: 1 }); // For user's custom templates
templateSchema.index({ isDefault: 1 }); // For default templates
templateSchema.index({ category: 1 }); // For filtering by category

export default mongoose.models.Template || mongoose.model('Template', templateSchema);


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      default: null,
    },
  },
  { timestamps: true }
);

// Create explicit indexes for performance
userSchema.index({ email: 1 }); // For login lookups
userSchema.index({ restaurant: 1 }); // For user-restaurant queries

export default mongoose.models.User || mongoose.model('User', userSchema);

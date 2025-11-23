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
    menuSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        // Colors
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        accentColor: '#000000',
        cardBackgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        priceColor: '#111827',
        
        // Typography
        fontFamily: 'Inter',
        headingSize: 'large',
        bodySize: 'medium',
        priceSize: 'medium',
        fontWeight: 'normal',
        
        // Layout
        cardStyle: 'elevated',
        gridColumns: 3,
        spacing: 'normal',
        borderRadius: 'rounded',
        
        // Visual
        backgroundType: 'solid',
        showDescriptions: true,
        showCategoryHeaders: true,
        
        // Advanced Customization
        headingWeight: 'bold',
        headingStyle: 'normal',
        textBold: false,
        textItalic: false,
        textUnderline: false,
        showBulletPoints: false,
        bulletStyle: 'disc',
        bulletColor: '#000000',
        pricePosition: 'right',
        priceFormat: 'standard',
        showCurrencySymbol: true,
        priceBold: false,
        cardShadow: 'lg',
        cardBorderWidth: '1',
        cardHoverEffect: true,
        cardPadding: 'normal',
        sections: [],
        defaultItemImageUrl: '',
      },
    },
    tvSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        // Colors (TV optimized - darker backgrounds)
        backgroundColor: '#000000',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        cardBackgroundColor: '#1a1a1a',
        borderColor: '#333333',
        priceColor: '#ffffff',
        
        // Typography (TV optimized - larger sizes)
        fontFamily: 'Inter',
        headingSize: 'large',
        bodySize: 'large',
        priceSize: 'large',
        fontWeight: 'bold',
        
        // Layout (TV optimized)
        cardStyle: 'minimal',
        gridColumns: 2,
        spacing: 'spacious',
        borderRadius: 'rounded',
        
        // Visual
        backgroundType: 'solid',
        showDescriptions: true,
        showCategoryHeaders: true,
        
        // Advanced Customization (TV optimized)
        headingWeight: 'bold',
        headingStyle: 'normal',
        textBold: false,
        textItalic: false,
        textUnderline: false,
        showBulletPoints: false,
        bulletStyle: 'disc',
        bulletColor: '#ffffff',
        pricePosition: 'right',
        priceFormat: 'standard',
        showCurrencySymbol: true,
        priceBold: true,
        cardShadow: 'none',
        cardBorderWidth: '0',
        cardHoverEffect: false,
        cardPadding: 'spacious',
        sections: [],
        defaultItemImageUrl: '',
      },
    },
  },
  { timestamps: true }
);

// Create explicit indexes for performance (multi-tenant optimization)
restaurantSchema.index({ restaurantId: 1 }, { unique: true }); // For public menu lookups (unique)
restaurantSchema.index({ owner: 1 }); // For user-restaurant queries

export default mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

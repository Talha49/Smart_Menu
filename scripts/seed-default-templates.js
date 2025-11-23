/**
 * Script to seed default templates into the database
 * Run with: node scripts/seed-default-templates.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Define template schema inline to avoid ES module issues
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
      default: null,
    },
    category: {
      type: String,
      enum: ['menu', 'tv', 'both'],
      default: 'both',
    },
  },
  { timestamps: true }
);

// Create indexes
templateSchema.index({ restaurant: 1 });
templateSchema.index({ isDefault: 1 });
templateSchema.index({ category: 1 });

const Template = mongoose.models.Template || mongoose.model('Template', templateSchema);

const defaultTemplates = [
  {
    name: 'Classic Elegant',
    description: 'A timeless, elegant design with sophisticated colors and typography. Perfect for fine dining restaurants.',
    category: 'both',
    isDefault: true,
    settings: {
      backgroundColor: '#1a1a1a',
      textColor: '#f5f5f5',
      accentColor: '#d4af37',
      cardBackgroundColor: '#2a2a2a',
      borderColor: '#3a3a3a',
      priceColor: '#d4af37',
      fontFamily: 'Playfair Display',
      headingSize: 'large',
      bodySize: 'medium',
      priceSize: 'medium',
      fontWeight: 'normal',
      headingWeight: 'bold',
      cardStyle: 'elevated',
      gridColumns: 2,
      spacing: 'spacious',
      borderRadius: 'rounded',
      cardShadow: 'lg',
      cardBorderWidth: '1',
      cardHoverEffect: true,
      showDescriptions: true,
      showCategoryHeaders: true,
    },
  },
  {
    name: 'Modern Minimal',
    description: 'Clean, minimal design with lots of white space. Great for cafes and modern restaurants.',
    category: 'both',
    isDefault: true,
    settings: {
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
      accentColor: '#000000',
      cardBackgroundColor: '#f9fafb',
      borderColor: '#e5e7eb',
      priceColor: '#1a1a1a',
      fontFamily: 'Inter',
      headingSize: 'large',
      bodySize: 'medium',
      priceSize: 'medium',
      fontWeight: 'normal',
      headingWeight: 'bold',
      cardStyle: 'minimal',
      gridColumns: 3,
      spacing: 'normal',
      borderRadius: 'rounded',
      cardShadow: 'sm',
      cardBorderWidth: '0',
      cardHoverEffect: true,
      showDescriptions: true,
      showCategoryHeaders: true,
    },
  },
  {
    name: 'Bold & Vibrant',
    description: 'Eye-catching design with bold colors and modern typography. Perfect for casual dining and bars.',
    category: 'both',
    isDefault: true,
    settings: {
      backgroundColor: '#f8f9fa',
      textColor: '#212529',
      accentColor: '#ff6b6b',
      cardBackgroundColor: '#ffffff',
      borderColor: '#ff6b6b',
      priceColor: '#ff6b6b',
      fontFamily: 'Montserrat',
      headingSize: 'large',
      bodySize: 'medium',
      priceSize: 'large',
      fontWeight: 'bold',
      headingWeight: 'bold',
      cardStyle: 'bordered',
      gridColumns: 3,
      spacing: 'normal',
      borderRadius: 'very-rounded',
      cardShadow: 'md',
      cardBorderWidth: '2',
      cardHoverEffect: true,
      showDescriptions: true,
      showCategoryHeaders: true,
    },
  },
  {
    name: 'TV Display - High Contrast',
    description: 'Optimized for TV displays with high contrast and large fonts. Perfect for digital menu boards.',
    category: 'tv',
    isDefault: true,
    settings: {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      accentColor: '#00ff00',
      cardBackgroundColor: '#1a1a1a',
      borderColor: '#333333',
      priceColor: '#00ff00',
      fontFamily: 'Oswald',
      headingSize: 'large',
      bodySize: 'large',
      priceSize: 'large',
      fontWeight: 'bold',
      headingWeight: 'bold',
      cardStyle: 'minimal',
      gridColumns: 2,
      spacing: 'spacious',
      borderRadius: 'rounded',
      cardShadow: 'none',
      cardBorderWidth: '0',
      cardHoverEffect: false,
      showDescriptions: true,
      showCategoryHeaders: true,
    },
  },
  {
    name: 'Warm & Cozy',
    description: 'A warm, inviting design with earthy tones. Great for family restaurants and comfort food places.',
    category: 'menu',
    isDefault: true,
    settings: {
      backgroundColor: '#f5f1e8',
      textColor: '#3d2817',
      accentColor: '#8b4513',
      cardBackgroundColor: '#ffffff',
      borderColor: '#d4a574',
      priceColor: '#8b4513',
      fontFamily: 'Merriweather',
      headingSize: 'large',
      bodySize: 'medium',
      priceSize: 'medium',
      fontWeight: 'normal',
      headingWeight: 'bold',
      cardStyle: 'elevated',
      gridColumns: 2,
      spacing: 'spacious',
      borderRadius: 'rounded',
      cardShadow: 'lg',
      cardBorderWidth: '1',
      cardHoverEffect: true,
      showDescriptions: true,
      showCategoryHeaders: true,
    },
  },
];

async function seedTemplates() {
  try {
    console.log('🌱 Starting template seeding...');
    console.log('📁 Loading environment from .env.local\n');

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please define MONGODB_URI in .env.local file');
    }

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing default templates
    await Template.deleteMany({ isDefault: true });
    console.log('🧹 Cleared existing default templates\n');

    // Insert new default templates
    const inserted = await Template.insertMany(defaultTemplates);
    console.log(`✅ Successfully seeded ${inserted.length} default templates:\n`);
    inserted.forEach((t) => {
      console.log(`   ✓ ${t.name} (${t.category})`);
    });
    console.log('\n🎉 Template seeding completed!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding templates:', error.message);
    if (error.message.includes('MONGODB_URI')) {
      console.error('\n💡 Make sure you have MONGODB_URI in your .env.local file');
      console.error('   Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname\n');
    }
    process.exit(1);
  }
}

seedTemplates();

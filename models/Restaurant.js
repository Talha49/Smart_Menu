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
        
        // Theme Studio: Advanced Visual Customization Engine
        // This provides granular control over every visual aspect of the menu
        // When present, themeConfig takes priority over vibeTokens for rendering
        themeConfig: {
            // Schema version for future migrations
            version: { type: String, default: "2.0" },
            
            // 🎨 Background System - Full control over page background
            background: {
                type: { 
                    type: String, 
                    enum: ['solid', 'gradient', 'pattern', 'image', 'animated'], 
                    default: 'solid' 
                },
                
                // Solid color background
                color: { type: String, default: "#FFFFFF" },
                
                // Gradient backgrounds (linear or radial)
                gradient: {
                    type: { type: String, enum: ['linear', 'radial'] },
                    angle: { type: Number, min: 0, max: 360 },
                    stops: [{
                        color: String,
                        position: { type: Number, min: 0, max: 100 }
                    }]
                },
                
                // Pattern backgrounds (procedurally generated)
                pattern: {
                    type: { type: String, enum: ['dots', 'grid', 'waves', 'checkered', 'custom'] },
                    color: String,
                    opacity: { type: Number, min: 0, max: 1 },
                    scale: { type: Number, min: 0.5, max: 3 }
                },
                
                // Image/video backgrounds
                media: {
                    url: String,
                    position: { type: String, default: 'center' },
                    size: { type: String, default: 'cover' },
                    blur: { type: Number, min: 0, max: 20 },
                    overlay: {
                        color: String,
                        opacity: { type: Number, min: 0, max: 1 }
                    }
                }
            },
            
            // ✍️ Typography System - Complete font control
            typography: {
                fonts: {
                    heading: { 
                        family: { type: String, default: "Inter" }, 
                        weight: { type: Number, default: 700 } 
                    },
                    body: { 
                        family: { type: String, default: "Inter" }, 
                        weight: { type: Number, default: 400 } 
                    },
                    accent: { 
                        family: { type: String, default: "Inter" }, 
                        weight: { type: Number, default: 600 } 
                    }
                },
                
                // Modular scale for consistent sizing
                sizes: {
                    base: { type: Number, default: 16 },
                    scale: { type: Number, default: 1.25 },
                    categoryTitle: Number,
                    itemName: Number,
                    itemDescription: Number,
                    price: Number
                },
                
                lineHeights: {
                    tight: { type: Number, default: 1.25 },
                    normal: { type: Number, default: 1.5 },
                    relaxed: { type: Number, default: 1.75 }
                },
                
                letterSpacing: {
                    tight: { type: Number, default: -0.02 },
                    normal: { type: Number, default: 0 },
                    wide: { type: Number, default: 0.05 }
                }
            },
            
            // 🎨 Comprehensive Color System
            colors: {
                brand: {
                    primary: { type: String, default: "#4f46e5" },
                    secondary: { type: String, default: "#f43f5e" },
                    tertiary: { type: String, default: "#10b981" }
                },
                
                backgrounds: {
                    page: { type: String, default: "#FFFFFF" },
                    card: { type: String, default: "#F9FAFB" },
                    elevated: { type: String, default: "#FFFFFF" }
                },
                
                text: {
                    primary: { type: String, default: "#111827" },
                    secondary: { type: String, default: "#6B7280" },
                    tertiary: { type: String, default: "#9CA3AF" },
                    inverse: { type: String, default: "#FFFFFF" }
                },
                
                borders: {
                    light: { type: String, default: "#E5E7EB" },
                    medium: { type: String, default: "#D1D5DB" },
                    dark: { type: String, default: "#9CA3AF" }
                },
                
                semantic: {
                    success: { type: String, default: "#10B981" },
                    warning: { type: String, default: "#F59E0B" },
                    error: { type: String, default: "#EF4444" },
                    info: { type: String, default: "#3B82F6" }
                }
            },
            
            // 📏 Spacing System - Design tokens for consistent spacing
            spacing: {
                unit: { type: Number, default: 4 },
                scale: { type: [Number], default: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256] },
                cardPadding: { type: Number, default: 16 },
                sectionGap: { type: Number, default: 48 },
                itemGap: { type: Number, default: 16 }
            },
            
            // 🔲 Border & Shape System
            borders: {
                radius: {
                    none: { type: Number, default: 0 },
                    sm: { type: Number, default: 4 },
                    md: { type: Number, default: 8 },
                    lg: { type: Number, default: 16 },
                    xl: { type: Number, default: 24 },
                    xxl: { type: Number, default: 32 },
                    full: { type: Number, default: 9999 }
                },
                
                widths: {
                    none: { type: Number, default: 0 },
                    thin: { type: Number, default: 1 },
                    medium: { type: Number, default: 2 },
                    thick: { type: Number, default: 4 }
                }
            },
            
            // 🌫️ Shadow System - Predefined elevation levels
            shadows: {
                none: { type: String, default: "none" },
                sm: { type: String, default: "0 1px 2px rgba(0,0,0,0.05)" },
                md: { type: String, default: "0 4px 6px rgba(0,0,0,0.1)" },
                lg: { type: String, default: "0 10px 15px rgba(0,0,0,0.1)" },
                xl: { type: String, default: "0 20px 25px rgba(0,0,0,0.15)" },
                xxl: { type: String, default: "0 25px 50px rgba(0,0,0,0.25)" }
            },
            
            // 🍽️ Menu Item Card Configuration
            menuItem: {
                layout: { 
                    type: String, 
                    enum: ['horizontal', 'vertical', 'overlay', 'minimal'], 
                    default: 'horizontal' 
                },
                
                image: {
                    enabled: { type: Boolean, default: true },
                    shape: { type: String, enum: ['square', 'circle', 'rounded'], default: 'rounded' },
                    aspectRatio: { type: String, default: '1/1' },
                    position: { type: String, enum: ['left', 'right', 'top', 'background'], default: 'left' },
                    objectFit: { type: String, enum: ['cover', 'contain'], default: 'cover' },
                    borderRadius: { type: String, default: 'md' }
                },
                
                card: {
                    background: { type: String, default: 'card' },
                    borderRadius: { type: String, default: 'lg' },
                    shadow: { type: String, default: 'md' },
                    border: {
                        width: { type: String, default: 'none' },
                        color: { type: String, default: 'light' }
                    },
                    padding: { type: Number, default: 16 },
                    hoverEffect: { 
                        type: String, 
                        enum: ['lift', 'glow', 'scale', 'none'], 
                        default: 'lift' 
                    }
                },
                
                content: {
                    alignment: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
                    nameSize: Number,
                    descriptionSize: Number,
                    priceSize: Number,
                    pricePosition: { 
                        type: String, 
                        enum: ['inline', 'bottom-right', 'badge'], 
                        default: 'inline' 
                    }
                }
            },
            
            // 📑 Category Section Styling
            categorySection: {
                header: {
                    style: { 
                        type: String, 
                        enum: ['bold', 'elegant', 'playful', 'minimal'], 
                        default: 'bold' 
                    },
                    size: { type: Number, default: 32 },
                    color: { type: String, default: 'primary' },
                    alignment: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
                    decoration: {
                        type: { 
                            type: String, 
                            enum: ['underline', 'dots', 'line', 'custom', 'none'], 
                            default: 'none' 
                        },
                        color: { type: String, default: 'primary' },
                        thickness: { type: Number, default: 2 }
                    }
                },
                
                spacing: {
                    top: { type: Number, default: 48 },
                    bottom: { type: Number, default: 24 }
                }
            },
            
            // 🎭 Decorative Elements Layer
            decorations: {
                enabled: { type: Boolean, default: false },
                
                elements: [{
                    id: String,
                    type: { type: String, enum: ['image', 'svg', 'pattern'] },
                    position: {
                        x: String, // 'left', 'center', 'right', '10px'
                        y: String  // 'top', 'center', 'bottom', '20px'
                    },
                    asset: String, // URL or data URI
                    size: {
                        width: Number,
                        height: Number
                    },
                    opacity: { type: Number, min: 0, max: 1, default: 1 },
                    zIndex: { type: Number, default: 1 }
                }],
                
                // Border decorations (checkered patterns, etc.)
                borderDecoration: {
                    type: { 
                        type: String, 
                        enum: ['checkered', 'dotted', 'dashed', 'custom', 'none'], 
                        default: 'none' 
                    },
                    color: String,
                    width: { type: Number, default: 20 },
                    position: { 
                        type: String, 
                        enum: ['all', 'top', 'bottom', 'left', 'right'], 
                        default: 'all' 
                    }
                }
            },
            
            // 🎬 Animation Preferences
            animations: {
                reducedMotion: { type: Boolean, default: false },
                
                pageLoad: {
                    type: { 
                        type: String, 
                        enum: ['fade', 'slide', 'scale', 'none'], 
                        default: 'fade' 
                    },
                    duration: { type: Number, default: 800 },
                    easing: { type: String, default: 'easeOut' }
                },
                
                itemEntrance: {
                    type: { 
                        type: String, 
                        enum: ['fade', 'slide-up', 'scale', 'stagger', 'none'], 
                        default: 'stagger' 
                    },
                    duration: { type: Number, default: 600 },
                    delay: { type: Number, default: 50 }
                },
                
                interactions: {
                    hover: { 
                        type: String, 
                        enum: ['lift', 'glow', 'scale', 'rotate', 'none'], 
                        default: 'lift' 
                    },
                    tap: { 
                        type: String, 
                        enum: ['shrink', 'ripple', 'none'], 
                        default: 'shrink' 
                    }
                }
            }
        },
        
        // 📐 Layout Configuration (separate from theme for clarity)
        layoutConfig: {
            type: { 
                type: String, 
                enum: ['grid', 'carousel', 'masonry', 'list', 'orbital', 'bento'], 
                default: 'grid' 
            },
            
            // Responsive behavior
            responsive: {
                mobile: { 
                    columns: { type: Number, default: 1 }, 
                    gap: { type: Number, default: 16 } 
                },
                tablet: { 
                    columns: { type: Number, default: 2 }, 
                    gap: { type: Number, default: 20 } 
                },
                desktop: { 
                    columns: { type: Number, default: 3 }, 
                    gap: { type: Number, default: 24 } 
                }
            },
            
            // Grid-specific configuration
            grid: {
                aspectRatio: { type: String, default: '1/1' },
                fillMode: { type: String, enum: ['balanced', 'masonry'], default: 'balanced' }
            },
            
            // Carousel-specific configuration
            carousel: {
                itemWidth: { type: String, default: '80vw' },
                centerMode: { type: Boolean, default: true },
                peek: { type: Number, default: 20 },
                infinite: { type: Boolean, default: true },
                autoplay: {
                    enabled: { type: Boolean, default: false },
                    interval: { type: Number, default: 3000 }
                }
            }
        }
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

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import { UpdateBrandingSchema } from "@/lib/validations";

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    const user = token ? await verifyJWT(token) : null;
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Get Restaurant
    const restaurant = await Restaurant.findOne({ owner: user.id });
    if (!restaurant) {
        return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    // 2. Check Plan (Pro Only)
    if (restaurant.plan !== 'pro') {
        return NextResponse.json({ message: "Branding customization is a Pro feature. Please upgrade." }, { status: 403 });
    }

    const body = await req.json();
    
    // 3. Validate Input
    const validation = UpdateBrandingSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json({ 
            message: "Invalid input", 
            errors: validation.error.flatten() 
        }, { status: 400 });
    }

    const { brandColor, fontFamily, logoUrl, experienceConfig } = validation.data;

    // 4. Update Fields
    if (brandColor) restaurant.brandColor = brandColor;
    if (fontFamily) restaurant.fontFamily = fontFamily;
    if (logoUrl !== undefined) restaurant.logoUrl = logoUrl;
    
    if (experienceConfig) {
        const currentConfig = restaurant.experienceConfig || {};
        
        restaurant.experienceConfig = {
            ...currentConfig,
            ...experienceConfig,
            visualDNA: {
                ...(currentConfig.visualDNA || {}),
                ...(experienceConfig.visualDNA || {})
            },
            seasonalAtmosphere: {
                ...(currentConfig.seasonalAtmosphere || {}),
                ...(experienceConfig.seasonalAtmosphere || {})
            }
        };
    }

    await restaurant.save();

    return NextResponse.json({ message: "Branding updated successfully", restaurant });

  } catch (error) {
    console.error("Error updating branding:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

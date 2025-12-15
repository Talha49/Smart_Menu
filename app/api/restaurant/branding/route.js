import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";

export async function PUT(req) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Get Restaurant
    const restaurant = await Restaurant.findOne({ owner: session.user.id });
    if (!restaurant) {
        return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    // 2. Check Plan (Pro Only)
    // Note: If you want to allow Free users to see but not save, handle it in frontend. 
    // Here we strictly enforce it for security.
    if (restaurant.plan !== 'pro') {
        return NextResponse.json({ message: "Branding customization is a Pro feature. Please upgrade." }, { status: 403 });
    }

    const body = await req.json();
    const { brandColor, fontFamily, logoUrl } = body;

    // 3. Update Fields
    if (brandColor) restaurant.brandColor = brandColor;
    if (fontFamily) restaurant.fontFamily = fontFamily;
    if (logoUrl !== undefined) restaurant.logoUrl = logoUrl; // Allow clearing logo with empty string

    await restaurant.save();

    return NextResponse.json({ message: "Branding updated successfully", restaurant });

  } catch (error) {
    console.error("Error updating branding:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

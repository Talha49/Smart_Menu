import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import Restaurant from "@/models/Restaurant";
import { MenuItemSchema } from "@/lib/validations";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Ensure we have a restaurant link
    // We can rely on session.user.restaurantId or fetch from DB if needed for security flexibility
    // Using session for speed
    let restaurantId = session.user.restaurantId;
    
    // Fallback if not in session (Edge case)
    if (!restaurantId) {
       const rest = await Restaurant.findOne({ owner: session.user.id });
       if (!rest) return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
       restaurantId = rest.restaurantId; // Assuming we use _id ref? Note: Models usually Ref ObjectId.
       // Let's check MenuItem model: restaurant: { type: ObjectId, ref: 'Restaurant' }
       // So we need the _id, not the string ID.
       
       // Wait, if restaurantId in session is the slug? 
       // User model doesn't store restaurant ObjectId directly?
       // Let's check the Restaurant model structure again.
       // Restaurant.js: restaurantId (slug), owner (user ObjectId).
       // MenuItem.js: restaurant (ObjectId ref).
       
       // So we need the Restaurant Object ID.
    }
    
    // Always safer to fetch the Restaurant Object ID based on the authenticated user to prevent IDOR
    const restaurant = await Restaurant.findOne({ owner: session.user.id });
    if (!restaurant) {
        return NextResponse.json({ message: "Restaurant setup required" }, { status: 404 });
    }

    const query = { restaurant: restaurant._id };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Prioritize manual order
    const items = await MenuItem.find(query).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
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

    // 2. Check Plan Limits (Free = 15 items)
    if (restaurant.plan === 'free') {
        const count = await MenuItem.countDocuments({ restaurant: restaurant._id });
        if (count >= 15) {
            return NextResponse.json({ message: "Free tier limit reached (15 items). Upgrade to Pro for unlimited items." }, { status: 403 });
        }
    }

    // 3. Validate Input
    const body = await req.json();
    const validation = MenuItemSchema.safeParse(body);
    
    if (!validation.success) {
        return NextResponse.json({ message: "Invalid input", errors: validation.error.flatten() }, { status: 400 });
    }

    // 4. Find max order within this category
    const lastItem = await MenuItem.findOne({ 
        restaurant: restaurant._id, 
        category: validation.data.category 
    }).sort({ order: -1 });
    const nextOrder = lastItem ? (lastItem.order || 0) + 1 : 0;

    // 5. Create Item
    const newItem = await MenuItem.create({
        ...validation.data,
        restaurant: restaurant._id,
        order: nextOrder
    });

    return NextResponse.json({ item: newItem }, { status: 201 });

  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

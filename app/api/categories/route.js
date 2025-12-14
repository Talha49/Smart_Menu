import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Restaurant from "@/models/Restaurant";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const restaurant = await Restaurant.findOne({ owner: session.user.id });
    if (!restaurant) return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });

    // Sort by createdAt (creation order) instead of 'order'
    const categories = await Category.find({ restaurant: restaurant._id }).sort({ createdAt: 1 });

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, emoji } = await req.json();
    if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });

    await dbConnect();
    const restaurant = await Restaurant.findOne({ owner: session.user.id });
    if (!restaurant) return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });

    // Check existing
    const existing = await Category.findOne({ restaurant: restaurant._id, name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) {
        return NextResponse.json({ message: "Category with this name already exists" }, { status: 400 });
    }

    const category = await Category.create({
        name,
        restaurant: restaurant._id,
        emoji: emoji || "🍽️" // Default if not provided
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
        return NextResponse.json({ message: "Category already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import Restaurant from "@/models/Restaurant";

export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // Await params in newer Next.js versions
    const { isAvailable } = await req.json();

    await dbConnect();

    // Verify ownership indirectly by checking if restaurant owned by user has this item?
    // Or fetch restaurant first.
    const restaurant = await Restaurant.findOne({ owner: session.user.id });
    
    if (!restaurant) return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });

    // Ensure item belongs to this restaurant
    const updatedItem = await MenuItem.findOneAndUpdate(
        { _id: id, restaurant: restaurant._id },
        { isAvailable },
        { new: true }
    );

    if (!updatedItem) {
        return NextResponse.json({ message: "Item not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updatedItem });

  } catch (error) {
    console.error("Error toggling availability:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

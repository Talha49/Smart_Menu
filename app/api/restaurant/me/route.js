import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Use restaurantId from session if available, or find by owner
    // Session strategy updates can ensure restaurantId is present
    let restaurant = await Restaurant.findOne({ owner: session.user.id });

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { CreateRestaurantSchema } from "@/lib/validations";
import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import User from "@/models/User";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // 1. Validate Input
    const validatedFields = CreateRestaurantSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, restaurantId, type, brandColor, logoUrl } = validatedFields.data;

    await dbConnect();

    // 2. Check availability
    const existing = await Restaurant.findOne({ restaurantId });
    if (existing) {
      return NextResponse.json(
        { message: "Restaurant ID is already taken" },
        { status: 409 }
      );
    }

    // 3. Create Restaurant
    const restaurant = await Restaurant.create({
      name,
      restaurantId,
      owner: session.user.id,
      brandColor: brandColor || "#4f46e5",
      logoUrl: logoUrl || "",
      fontFamily: "Inter",
    });

    // 4. Update User with restaurant reference
    await User.findByIdAndUpdate(session.user.id, {
      restaurant: restaurant._id
    });

    return NextResponse.json(
      { message: "Restaurant created successfully", restaurant },
      { status: 201 }
    );
  } catch (error) {
    console.error("Restaurant creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import Restaurant from "@/models/Restaurant";
import { MenuItemSchema } from "@/lib/validations";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const item = await MenuItem.findById(id);

    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    await dbConnect();
    const restaurant = await Restaurant.findOne({ owner: session.user.id });
    if (!restaurant) return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });

    // Validate Input
    const validation = MenuItemSchema.partial().safeParse(body);
    if (!validation.success) {
        return NextResponse.json({ message: "Invalid input", errors: validation.error.flatten() }, { status: 400 });
    }

    const updatedItem = await MenuItem.findOneAndUpdate(
        { _id: id, restaurant: restaurant._id },
        validation.data,
        { new: true }
    );

    if (!updatedItem) return NextResponse.json({ message: "Item not found or unauthorized" }, { status: 404 });

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await dbConnect();
    const restaurant = await Restaurant.findOne({ owner: session.user.id });
    if (!restaurant) return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });

    const deletedItem = await MenuItem.findOneAndDelete({ _id: id, restaurant: restaurant._id });

    if (!deletedItem) return NextResponse.json({ message: "Item not found or unauthorized" }, { status: 404 });

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

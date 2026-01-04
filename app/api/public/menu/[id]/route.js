import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category"; 

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        // 1. Find the restaurant + Select the new businessProfile object
        const restaurant = await Restaurant.findOne({ restaurantId: id })
            .select({
                name: 1, 
                logoUrl: 1, 
                brandColor: 1, 
                fontFamily: 1,
                restaurantId: 1,
                plan: 1,
                businessProfile: 1, 
                experienceConfig: 1, // Added for dynamic layouts
                _id: 1
            })
            .lean();

        if (!restaurant) {
            return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
        }

        const categories = await Category.find({ restaurant: restaurant._id }).sort({ sortOrder: 1 }).lean();

        const menuItems = await MenuItem.find({ 
            restaurant: restaurant._id,
            isAvailable: true 
        }).sort({ isFeatured: -1, sortOrder: 1 }).lean();

        const groupedMenu = categories.map(cat => ({
            ...cat,
            items: menuItems.filter(item => item.category === cat.name)
        })).filter(group => group.items.length > 0);

        return NextResponse.json({
            restaurant,
            menu: groupedMenu
        });

    } catch (error) {
        console.error("Public Menu API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

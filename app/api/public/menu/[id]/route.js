import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category"; 

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ 
                error: "No ID provided",
                debug: { id: null }
            }, { status: 400 });
        }

        // 1. Find the restaurant by its custom slug (restaurantId)
        // We use regex to be safe about case sensitivity and potential whitespace
        const restaurant = await Restaurant.findOne({ 
            restaurantId: { $regex: new RegExp(`^${id}$`, "i") } 
        })
        .select({
            name: 1, 
            logoUrl: 1, 
            brandColor: 1, 
            fontFamily: 1,
            restaurantId: 1,
            plan: 1,
            businessProfile: 1, 
            experienceConfig: 1,
            _id: 1
        })
        .lean();

        if (!restaurant) {
            console.log(`[Public Menu API] NOT FOUND: ${id}`);
            return NextResponse.json({ 
                error: "Restaurant not found",
                debug: { 
                    searchedId: id,
                    timestamp: new Date().toISOString(),
                    hint: "Check if the restaurantId in the database exactly matches this ID (including any random suffixes)."
                }
            }, { status: 404 });
        }

        // 2. Fetch categories and items
        const categories = await Category.find({ restaurant: restaurant._id }).sort({ sortOrder: 1 }).lean();

        const menuItems = await MenuItem.find({ 
            restaurant: restaurant._id,
            isAvailable: true 
        }).sort({ isFeatured: -1, sortOrder: 1 }).lean();

        // 3. Group menu items by category
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
        return NextResponse.json({ 
            error: "Internal Server Error",
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

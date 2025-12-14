import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category"; // Ensure we fetch categories to sort correctly

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params; // 'id' would be the 'restaurantId' string (slug)

        // 1. Find the restaurant
        const restaurant = await Restaurant.findOne({ restaurantId: id })
            .select({
                name: 1, 
                logoUrl: 1, 
                brandColor: 1, 
                fontFamily: 1,
                restaurantId: 1,
                plan: 1,
                _id: 1
            })
            .lean();

        if (!restaurant) {
            return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
        }

        // 2. Fetch all categories for this restaurant (to order them if we had order field, or just list)
        // We'll trust the menu items to have valid category names, 
        // but fetching categories helps us know the "official" list/order if needed.
        // For now, we'll group by the category string stored in MenuItem to save a query if possible, 
        // BUT fetching Category models allows us to get the EMOJI.
        const categories = await Category.find({ restaurant: restaurant._id }).sort({ createdAt: 1 }).lean();

        // 3. Fetch all AVAILABLE menu items
        const menuItems = await MenuItem.find({ 
            restaurant: restaurant._id,
            isAvailable: true 
        }).sort({ order: 1 }).lean();

        // 4. Group items by category
        // We iterate through the defined `categories` to preserve their created order (or manual order in future)
        // Items that have a category NOT in the categories list (edge case) could be grouped under "Other"
        
        const groupedMenu = categories.map(cat => ({
            ...cat,
            items: menuItems.filter(item => item.category === cat.name)
        })).filter(group => group.items.length > 0); // Only show categories with items

        return NextResponse.json({
            restaurant,
            menu: groupedMenu
        });

    } catch (error) {
        console.error("Public Menu API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

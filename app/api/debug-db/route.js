import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("[Diagnostics] Testing MongoDB connection...");
    const conn = await dbConnect();
    return NextResponse.json({ 
      status: "success", 
      message: "Database connected successfully",
      readyState: conn.connection.readyState 
    });
  } catch (error) {
    console.error("[Diagnostics] Database Connection Failed:", error);
    return NextResponse.json({ 
      status: "error", 
      message: error.message || "Unknown error",
      details: "Check Vercel logs and MongoDB IP whitelisting"
    }, { status: 500 });
  }
}

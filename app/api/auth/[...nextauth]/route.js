import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  return NextResponse.json({ 
    message: "Catch-all route is working!",
    params: params
  });
}

export async function POST() {
  return NextResponse.json({ message: "POST works too" });
}

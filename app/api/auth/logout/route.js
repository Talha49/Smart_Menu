import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Delete the auth-token cookie properly
  cookies().delete("auth-token");
  
  return NextResponse.json({ success: true });
}

import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function POST(request) {
  const { url } = await request.json();
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await del(url);
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

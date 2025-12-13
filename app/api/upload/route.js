import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await auth();
        if (!session) {
          throw new Error('Unauthorized');
        }
        
        // Optional: Validate file extension or size here if needed beyond client
        // Token generation allows the client to upload directly to Vercel Blob
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            userId: session.user.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Callback after upload is done. 
        // We don't strictly need to do DB work here as the client will receive the URL 
        // and submit it with the form, but logging is good.
        console.log('Upload completed:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 } // The webhook will retry 5 times automatically if the status code is 500
    );
  }
}

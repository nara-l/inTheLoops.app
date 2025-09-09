import { handleUpload } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Missing BLOB_READ_WRITE_TOKEN" }, { status: 500 });
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname) => {
        // Validate based on pathname extension
        const maxBytes = 100 * 1024 * 1024; // 100 MB
        
        if (!pathname.toLowerCase().endsWith('.mp4')) {
          throw new Error('Only MP4 files are allowed');
        }

        return {
          allowedContentTypes: ['video/mp4'],
          addRandomSuffix: true,
          maximumSizeInBytes: maxBytes,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload completed:', blob.url);
        // You can add any post-upload logic here
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('/api/upload-token error:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
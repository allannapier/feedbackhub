import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing simple OG image generation...')
    
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: 'black',
            background: 'white',
            width: '100%',
            height: '100%',
            padding: '50px 200px',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          Hello world 👋
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
    
    return imageResponse;
  } catch (error: any) {
    console.error('Simple OG test error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

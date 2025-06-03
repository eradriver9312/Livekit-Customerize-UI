import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { enabled } = await request.json();

    // Call the backend to toggle camera
    const response = await fetch(`${process.env.BACKEND_URL}/toggle-camera`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle camera on backend');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in toggle-camera API:', error);
    return NextResponse.json(
      { error: 'Failed to toggle camera' },
      { status: 500 }
    );
  }
} 
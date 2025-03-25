import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const response = await fetch(`${process.env.API_URL}/api/farmers/public/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch farmer data');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching farmer data:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 
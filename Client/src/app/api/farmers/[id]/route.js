import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Use environment-aware base URL
    const apiUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; // fallback if env var not set

    console.log('Incoming request params:', params);
    console.log('Farmer ID:', id);

    const cleanId = id.toString().replace(/\/$/, '');
    const url = `${apiUrl}/farmers/${cleanId}`;

    console.log('Attempting to fetch from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
      return NextResponse.json(
        {
          message: 'Failed to fetch farmer data',
          status: response.status,
          details: text,
        },
        { status: response.status }
      );
    }

    try {
      const data = await response.json();
      console.log('Successfully parsed response data:', data);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      const text = await response.text();
      return NextResponse.json(
        {
          message: 'Invalid JSON response from server',
          error: parseError.message,
          details: text,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request failed:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

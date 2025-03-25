import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const apiUrl = 'http://localhost:5000';
    
    // Log the incoming request details
    console.log('Incoming request params:', params);
    console.log('Farmer ID:', id);
    
    // Build the URL - make sure there are no trailing slashes
    const cleanId = id.toString().replace(/\/$/, '');
    const url = `${apiUrl}/farmers/${cleanId}`;
    
    console.log('Attempting to fetch from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Add cache: 'no-store' to prevent caching
      cache: 'no-store'
    });

    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Check if the response is OK first
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
      return NextResponse.json(
        { 
          message: 'Failed to fetch farmer data',
          status: response.status,
          details: text
        },
        { status: response.status }
      );
    }

    // Try to parse JSON
    try {
      const data = await response.json();
      console.log('Successfully parsed response data:', data);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      const text = await response.text();
      console.error('Raw response:', text);
      return NextResponse.json(
        { 
          message: 'Invalid JSON response from server',
          error: parseError.message,
          details: text
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request failed:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error.message
      },
      { status: 500 }
    );
  }
} 
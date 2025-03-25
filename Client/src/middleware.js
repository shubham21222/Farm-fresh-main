import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request (e.g. /admin/dashboard)
  const path = request.nextUrl.pathname;

  // Define protected paths
  const isAdminPath = path.startsWith('/Admin') && !path.includes('/login') && !path.includes('/register');
  const isFarmerPath = path.startsWith('/Farmer') && !path.includes('/login') && !path.includes('/register');
  
  // Get auth token from cookies
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // For protected routes (admin or farmer), check authentication
  if (isAdminPath || isFarmerPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if user has the correct role for the path
    if (isAdminPath && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (isFarmerPath && userRole !== 'farmer') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow access to all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/Admin/:path*',
    '/Farmer/:path*',
  ],
}; 
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request (e.g. /admin/dashboard)
  const path = request.nextUrl.pathname;

  // Check if the path is for authentication pages
  const isAuthPath = path === '/login' || path === '/register' || path === '/Farmer/login' || path === '/Farmer/register';
  const isAdminPath = path.startsWith('/Admin') && !path.includes('/login');
  const isFarmerPath = path.startsWith('/Farmer') && !path.includes('/login') && !path.includes('/register');
  
  // If it's an auth page, allow access
  if (isAuthPath) {
    return NextResponse.next();
  }

  // For protected routes (admin or farmer), check authentication
  if (isAdminPath || isFarmerPath) {
    // Get auth token from cookies
    const token = request.cookies.get('token')?.value;
    const userRole = request.cookies.get('userRole')?.value;
    
    if (!token) {
      // Redirect to the appropriate login page
      if (isAdminPath) {
        return NextResponse.redirect(new URL('/Admin/login', request.url));
      } else if (isFarmerPath) {
        return NextResponse.redirect(new URL('/Farmer/login', request.url));
      }
    }

    // Check if user has the correct role for the path
    if (isAdminPath && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/Admin/login', request.url));
    }
    if (isFarmerPath && userRole !== 'farmer') {
      return NextResponse.redirect(new URL('/Farmer/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/Admin/:path*',
    '/Farmer/:path*',
    '/login',
    '/register',
  ],
}; 
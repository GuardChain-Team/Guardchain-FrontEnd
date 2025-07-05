// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
      return NextResponse.next();

    // Check if user is accessing admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const token = req.nextauth.token;
      
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Check if user is accessing investigator routes
    if (req.nextUrl.pathname.startsWith('/investigator')) {
      const token = req.nextauth.token;
      
      if (!['ADMIN', 'FRAUD_INVESTIGATOR'].includes(token?.role as string)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public routes
        const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
        
        if (publicRoutes.includes(req.nextUrl.pathname)) {
          return true;
        }

        // Protected routes require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
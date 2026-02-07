import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { refresh } from 'next/cache';

export async function proxy(req: any) {
  console.log('Middleware triggered for:', req.nextUrl.pathname);

  const token = req.cookies.get('accessToken')?.value;

  // Không có token → cho vào public routes
  const publicPaths = [
    '/auth/signin', 
    '/auth/signup', 
    '/auth/google-callback',  // Allow Google OAuth callback
    '/auth/complete-profile',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/send-email-success',
    '/auth/resend-link',
    '/teacher',
    '/student',
  ];
  if (!token) {
    console.log('No token found, checking public paths.');
    console.log(req.nextUrl.pathname);
    if (publicPaths.some(path => req.nextUrl.pathname === path)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Giải mã token
  try {
    const decoded: any = jwt.decode(token);

    const role = decoded?.role;
    const path = req.nextUrl.pathname;

    console.log('Role:', role);
    console.log('Path:', path);

    // Nếu user cố truy cập vùng không thuộc role của mình
    if (path.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // if (path.startsWith('/teacher') && role !== 'teacher') {
    //   return NextResponse.redirect(new URL('/auth/signin', req.url));
    // }

    // Nếu user truy cập vùng authentication, direct về trang role/home
    if (path.startsWith('/auth')) {
      return NextResponse.redirect(new URL(`/${role}/home`, req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log(err);
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
}

// Áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: ['/student/:path*', '/teacher/:path*'], //'/auth/:path*'
};
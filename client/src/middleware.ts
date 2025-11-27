import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  console.log('Middleware triggered for:', req.nextUrl.pathname);
  const token = req.cookies.get('accessToken')?.value;

  // Không có token → cho vào public routes
  const publicPaths = ['/auth/signin', '/auth/signup', '/student', '/teacher'];
  if (!token) {
    // if (publicPaths.includes(req.nextUrl.pathname)) return NextResponse.next();
    // return NextResponse.redirect(new URL('/auth/signin', req.url));
    return NextResponse.next();
  }

  // Giải mã token
  try {
    const decoded: any = jwt.decode(token);

    const role = decoded?.role;
    const path = req.nextUrl.pathname;
    
    // Nếu user cố truy cập vùng không thuộc role của mình
    if (path.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    if (path.startsWith('/teacher') && role !== 'teacher') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
}

// Áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: ['/student/:path*', '/teacher/:path*'],
};

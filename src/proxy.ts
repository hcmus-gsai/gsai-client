import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { refresh } from 'next/cache';

export async function proxy(req: any) {
  console.log('Middleware triggered for:', req.nextUrl.pathname);

  const token = req.cookies.get('accessToken')?.value;
  const showcaseModeCookie = req.cookies.get('showcaseMode')?.value;

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
  ];
  if (!token) {

    if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))
      || req.nextUrl.pathname === '/'
      || req.nextUrl.pathname === '/student'
      || req.nextUrl.pathname === '/teacher'
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Giải mã token
  try {
    const decoded: any = jwt.decode(token);

    const role = decoded?.role;
    const path = req.nextUrl.pathname;
    const email = decoded?.email as string | undefined;
    const isShowcaseGuest = typeof email === 'string' && email.startsWith('showcase.guest.');
    const isShowcaseMode = showcaseModeCookie === '1' || isShowcaseGuest;
    const isStudentPath = path === '/student' || path.startsWith('/student/');
    const isTeacherPath = path === '/teacher' || path.startsWith('/teacher/');

    console.log('Role:', role);
    console.log('Path:', path);

    // Khi đang ở showcase mode thì không cho vào student/teacher chuẩn.
    if (isShowcaseMode && (isStudentPath || isTeacherPath)) {
      return NextResponse.redirect(new URL('/showcase/student', req.url));
    }

    // Nếu user cố truy cập vùng không thuộc role của mình
    if (isStudentPath && role !== 'student') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    if (isTeacherPath && role !== 'teacher') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

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
  matcher: ['/student/:path*', '/teacher/:path*', '/auth/:path*'], //'/auth/:path*'
};
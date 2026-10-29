import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'kanal-tiga-secret-key-purwokerto-2026-aman-super-secret'
);

const COOKIE_NAME = 'kanal_tiga_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Cek validitas token JWT
  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Jika belum login dan mengakses rute terproteksi
  const isLoginPage = pathname === '/login';
  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      // Hapus token kadaluarsa/tidak valid
      response.cookies.delete(COOKIE_NAME);
    }
    return response;
  }

  // Jika sudah login dan mencoba mengakses /login
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (unless protected)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, svg, icons
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

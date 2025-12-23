import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Definisikan rute "rumah" berdasarkan peran
const roleHomeRoutes = {
  Admin: '/admin',
  Staff: '/admin',
  'Manajer Keuangan': '/user',
  'General Manager': '/user',
  'General Affair': '/user',
  'Kadiv Keuangan': '/user',
  'Direktur Operasional': '/user',
  'Direktur Keuangan': '/user',
  'Direktur Utama': '/user'
}

// Rute yang hanya bisa diakses oleh role tertentu
const roleSpecificRoutes = ['/admin', '/user']
// Rute yang bisa diakses SEMUA user yang sudah login
const sharedProtectedRoutes = ['/account']

const publicRoutes = ['/unauthorized']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const refreshToken = request.cookies.get('refresh_token')?.value
  const userRole = request.cookies.get('user_role')?.value as keyof typeof roleHomeRoutes | undefined

  const isProtectedRoute = [...roleSpecificRoutes, ...sharedProtectedRoutes].some((prefix) => path.startsWith(prefix))

  if (!refreshToken && isProtectedRoute) {
    const portalUrl = process.env.API_PORTAL_URL || 'http://api.portal.bmuconnect.id/api'
    const clientId = process.env.CLIENT_ID || 'app_hrbmu'

    // Tentukan mau balik ke mana setelah login di portal (Halaman Frontend Callback Anda)
    // request.nextUrl.origin akan otomatis mengambil http://localhost:3000 atau domain production
    const redirectUri = encodeURIComponent(`https://hr.bmuconnect.id/auth/callback`)

    // Susun URL lengkap ke endpoint authorize Portal
    const ssoRedirectUrl = `${portalUrl}/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`

    // Lakukan redirect eksternal ke Portal
    return NextResponse.redirect(ssoRedirectUrl)
  }

  // 2. Jika sudah login
  if (refreshToken && userRole) {
    const homePath = roleHomeRoutes[userRole] || '/'

    // 2a. Jika mencoba akses halaman publik (login/register), arahkan ke dashboard masing-masing
    if (publicRoutes.includes(path)) {
      return NextResponse.redirect(new URL(homePath, request.nextUrl))
    }

    // Logika otorisasi yang fleksibel
    const isAllowed =
      // Izinkan jika path dimulai dengan homepath rolenya
      path.startsWith(homePath) ||
      // Izinkan jika path termasuk dalam rute bersama
      sharedProtectedRoutes.some((p) => path.startsWith(p))

    // 2b. Jika mencoba akses rute terproteksi tapi tidak diizinkan
    if (isProtectedRoute && !isAllowed) {
      // Opsional: Anda bisa redirect ke halaman 'Unauthorized' alih-alih homePath
      return NextResponse.redirect(new URL(homePath, request.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Matcher agar middleware tidak berjalan di file statis atau API internal
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

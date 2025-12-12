import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Definisikan rute "rumah" berdasarkan peran
const roleHomeRoutes = {
  Admin: '/admin',
  Staff: '/user',
  'Manajer Keuangan': '/user',
  GM: '/user',
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
  const refreshToken = request.cookies.get('hr_refresh_token')?.value
  const userRole = request.cookies.get('user_role')?.value as keyof typeof roleHomeRoutes | undefined

  // Cek apakah rute saat ini adalah salah satu dari rute yang perlu proteksi
  const isProtectedRoute = [...roleSpecificRoutes, ...sharedProtectedRoutes].some((prefix) => path.startsWith(prefix))

  // =====================================================================
  // PERUBAHAN UTAMA DI SINI
  // 1. Jika belum login dan mencoba akses halaman terproteksi -> Redirect ke PORTAL
  // =====================================================================
  if (!refreshToken && isProtectedRoute) {
    // Ambil URL Portal dan Client ID dari environment variable
    // Pastikan Anda sudah set env var ini di .env.local atau config Vercel/Server
    const portalUrl = process.env.API_PORTAL_URL || 'http://localhost:4000/api'
    const clientId = process.env.CLIENT_ID || 'app_feedback'

    // Tentukan mau balik ke mana setelah login di portal (Halaman Frontend Callback Anda)
    // request.nextUrl.origin akan otomatis mengambil http://localhost:3000 atau domain production
    const redirectUri = encodeURIComponent(`${request.nextUrl.origin}/auth/callback`)

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

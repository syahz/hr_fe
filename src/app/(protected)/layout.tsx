'use client'

import { USER_ROLES } from '@/config/roles'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { useRouter, usePathname } from 'next/navigation'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!user) {
      console.warn('AuthGuard: No user found, redirecting to login...')
      // router.push('/login')
      return
    }

    // --- PERBAIKAN LOGIKA OTORISASI ---
    let isAuthorized = false
    if (pathname.startsWith('/admin')) {
      isAuthorized = user.role === 'Admin' || user.role === 'Staff'
    } else if (pathname.startsWith('/user')) {
      isAuthorized = USER_ROLES.includes(user.role)
    } else if (pathname.startsWith('/account')) {
      // Semua pengguna yang sudah login (user !== null) boleh mengakses /account
      isAuthorized = true
    }
    // ------------------------------------

    if (!isAuthorized) {
      console.warn(`AuthGuard: Unauthorized role '${user.role}' for path '${pathname}', redirecting...`)
      router.push('/unauthorized')
    }
  }, [user, isLoading, router, pathname])

  // Tampilkan loading screen jika data belum siap
  if (isLoading || !user) {
    return <DynamicSkeleton variant="fullPageLoader" loaderText="Memuat Sesi..." />
  }

  // --- PERBAIKAN LOGIKA RENDER ---
  // Tampilkan konten hanya jika sudah selesai loading DAN diotorisasi
  const isUserAuthorized =
    (pathname.startsWith('/admin') && (user.role === 'Admin' || user.role === 'Staff')) ||
    (pathname.startsWith('/user') && USER_ROLES.includes(user.role)) ||
    pathname.startsWith('/account') // Semua user yang login boleh akses account

  if (isUserAuthorized) {
    return <>{children}</>
  }
  // -------------------------------

  return <DynamicSkeleton variant="fullPageLoader" loaderText="Mengalihkan..." />
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  )
}

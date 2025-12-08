'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function LoginErrorHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'unregistered_email') {
      toast.error('Login Gagal', {
        description: 'Email Google Anda tidak terdaftar di sistem. Silakan hubungi admin.'
      })
    } else if (error === 'google_login_failed') {
      toast.error('Login Gagal', {
        description: 'Terjadi kesalahan saat mencoba login dengan Google.'
      })
    }
  }, [searchParams])

  // Komponen ini tidak merender elemen visual apa pun
  return null
}

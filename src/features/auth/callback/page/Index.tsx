'use client'

import { useEffect } from 'react'
import { useSSOLogin } from '@/hooks/api/useAuth'
import { setAccessToken } from '@/lib/axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const Index = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const { mutateAsync: ssoLogin } = useSSOLogin()

  useEffect(() => {
    const run = async () => {
      if (!code) return
      try {
        const data = await ssoLogin(code)
        console.log(data)
        setAccessToken(data.accessToken)
        toast.success('Login berhasil!')
        router.push('/admin')
      } catch (err) {
        console.error(err)
        toast.error('Login gagal, silakan coba lagi.')
        router.push('/')
      }
    }
    run()
  }, [code, router, ssoLogin])

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Sedang memverifikasi login Anda...</p>
    </div>
  )
}

export default Index

import { Suspense } from 'react'
import Callback from '@/features/auth/callback/page/Index'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p>Memuat...</p>
        </div>
      }
    >
      <Callback />
    </Suspense>
  )
}

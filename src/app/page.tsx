'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useGetAllUnits } from '@/hooks/api/useUnit'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { data, isLoading, error } = useGetAllUnits()
  const units = data?.data ?? []

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 overflow-hidden"
      style={{ backgroundImage: "url('/img/bg-bmu.png')" }}
    >
      <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="inline-flex bg-white/95 p-4 rounded-3xl shadow-md items-center gap-6">
            <Image src="/img/logo/BMU.png" alt="Logo BMU" width={40} height={40} />
          </div>
          <h1 className="text-2xl font-bold text-white">Pilih Unit</h1>
          <p className="text-gray-200">Klik salah satu unit untuk memberikan feedback.</p>
        </div>

        {isLoading && <div className="text-white/80">Memuat daftar unit...</div>}
        {error && <div className="text-red-400">Gagal memuat unit.</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {units.map((u) => (
            <Link key={u.id} href={`/feedbacks/${u.id}`} className="group">
              <div className="flex flex-col items-center gap-3 justify-center p-4 rounded-xl bg-black/30 border border-white/20 hover:bg-black/40 transition h-40 w-full">
                <Image src={`/img/logo/${u.code}.png`} alt={u.name} width={40} height={40} className="rounded" />
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white text-center font-medium">{u.name}</p>
                </div>
                <Button size="sm" className="shrink-0">
                  Beri Feedback
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

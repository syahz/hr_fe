'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'
import { useGetAllDivisions } from '@/hooks/api/useDivision'

export default function HomePage() {
  const { data, isLoading, error } = useGetAllDivisions()
  const divisions = data?.data ?? []

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 overflow-hidden"
      style={{ backgroundImage: "url('/img/bg-bmu.png')" }}
    >
      <div className="w-full max-w-3xl mx-auto rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-white">Pilih Divisi</h1>
          <p className="text-sm text-gray-200 mt-1">Pilih salah satu divisi untuk memberikan feedback.</p>
        </div>

        {isLoading && <div className="text-white/80 py-6 text-center text-sm">Memuat daftar divisi...</div>}
        {error && <div className="text-red-400 py-6 text-center text-sm">Gagal memuat divisi.</div>}

        {!isLoading &&
          !error &&
          (divisions.length ? (
            <ul className="divide-y divide-white/15 rounded-xl overflow-hidden bg-black/25 border border-white/20">
              {divisions.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/feedbacks-ho/${d.id}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-black/40 transition group"
                  >
                    <span className="text-white font-medium truncate">{d.name}</span>
                    <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition">
                      Beri Feedback
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center text-sm text-white/70">Tidak ada divisi tersedia.</div>
          ))}
      </div>
    </div>
  )
}

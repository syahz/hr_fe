'use client'

import React from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { CreateSppForm } from '../components/forms/CreateSppForm'

export default function SppCreatePage() {
  return (
    <PageContainer title="Tambah SPP">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Form Tambah Surat Perintah Pembayaran</h2>
        <CreateSppForm />
      </div>
    </PageContainer>
  )
}

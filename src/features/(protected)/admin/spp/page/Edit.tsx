'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { PageContainer } from '@/components/layout/PageContainer'
import { EditSppForm } from '../components/forms/EditSppForm'

export default function EditSppPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id as string

  return <PageContainer>{id ? <EditSppForm id={id} /> : null}</PageContainer>
}

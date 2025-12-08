'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Eye } from 'lucide-react'
import { FeedbackHeadOffice } from '@/types/api/feedbackHOType'
import { DetailsFeedbackHOModal } from '../DetailsFeedbackHOModal'

interface FeedbackHOActionsCellProps {
  row: { original: FeedbackHeadOffice }
}

export function FeedbackHOActionsCell({ row }: FeedbackHOActionsCellProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const feedback = row.original

  return (
    <>
      {/* Modal detail feedback, dibuka saat tombol ditekan */}
      <DetailsFeedbackHOModal feedbackId={feedback.id} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Button onClick={() => setIsModalOpen(true)}>
        <Eye className="mr-2 h-4 w-4" />
        Lihat Detail
      </Button>
    </>
  )
}

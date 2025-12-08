'use client'

import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Feedback } from '@/types/api/feedbackType'
import { useState } from 'react'
import { DetailsFeedbackModal } from '../DetailsFeedbackModal'

interface FeedbackActionsCellProps {
  row: { original: Feedback }
}

export function FeedbackActionsCell({ row }: FeedbackActionsCellProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const feedback = row.original

  return (
    <>
      {/* Modal detail feedback, dibuka saat tombol ditekan */}
      <DetailsFeedbackModal feedbackId={feedback.id} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Button onClick={() => setIsModalOpen(true)}>
        <Eye className="mr-2 h-4 w-4" />
        Lihat Detail
      </Button>
    </>
  )
}

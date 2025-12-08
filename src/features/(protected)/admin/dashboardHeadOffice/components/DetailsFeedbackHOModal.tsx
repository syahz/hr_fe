import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useGetFeedbackHeadOfficeDetails } from '@/hooks/api/useFeedbackHO'

interface DetailsFeedbackHOModalProps {
  feedbackId: string | null
  isOpen: boolean
  onClose: () => void
}

// --- Helper Komponen untuk Ikon Bintang (Inline SVG) ---
// Kita letakkan di sini agar tidak perlu import baru
const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.86c-1-.608-2.231.29-1.96 1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433L10.788 3.21z"
      clipRule="evenodd"
    />
  </svg>
)

// --- Helper Komponen untuk Menampilkan Rating Bintang ---
const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5
  return (
    <div className="flex items-center space-x-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1
        return (
          <StarIcon
            key={index}
            className={`
              h-6 w-6
              ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
            `}
          />
        )
      })}
      <span className="ml-2 text-lg font-semibold text-foreground">
        {rating}
        <span className="text-sm font-normal text-muted-foreground"> / 5</span>
      </span>
    </div>
  )
}

export function DetailsFeedbackHOModal({ feedbackId, isOpen, onClose }: DetailsFeedbackHOModalProps) {
  // useGetFeedbackDetails now accepts optional id and will only run when id is provided
  const { data: feedback, isLoading, error } = useGetFeedbackHeadOfficeDetails(feedbackId ?? undefined)

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="text-base text-muted-foreground">Memuat detail...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="text-base text-red-600">Gagal memuat detail feedback.</div>
        </div>
      )
    }

    if (feedback) {
      return (
        <div className="space-y-6 pt-2 pb-4">
          {/* Bagian Rating */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Rating Pengguna</h3>
            <StarRating rating={feedback.rating} />
          </div>

          {/* Bagian Saran */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Saran</h3>
            <div className="p-4 bg-muted/50 border rounded-lg min-h-[100px]">
              <p className="whitespace-pre-wrap text-base text-foreground">
                {feedback.suggestion || <span className="text-muted-foreground italic">Tidak ada saran yang diberikan.</span>}
              </p>
            </div>
          </div>

          {/* Bagian Unit */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Divisi Terkait</h3>
            <p className="font-medium text-base text-foreground">{feedback.division?.name ?? '-'}</p>
          </div>

          {/* Tombol Tutup */}
          <div className="pt-6 flex justify-end">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Tutup
            </Button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Detail Feedback</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai masukan pengguna.</DialogDescription>
        </DialogHeader>

        {/* Konten dipisah agar bisa di-scroll jika terlalu panjang */}
        <div className="max-h-[70vh] overflow-y-auto px-6">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  )
}

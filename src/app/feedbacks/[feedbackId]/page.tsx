'use client'

import { Button } from '@/components/ui/button'
import { useGetAllUnits } from '@/hooks/api/useUnit'
import Image from 'next/image'
import { useCreateFeedback } from '@/hooks/api/useFeedback'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { CreateFeedbackRequest } from '@/types/api/feedbackType'
import { useParams, useRouter } from 'next/navigation'

// --- Komponen Logo ---
const LogoContainer: React.FC<{ unitCode?: string }> = ({ unitCode }) => (
  <div className="inline-flex bg-white/95 p-4 sm:p-6 rounded-b-3xl shadow-md items-center gap-6 mb-8">
    <Image src="/img/logo/BMU.png" alt="Logo BMU" width={40} height={40} />
    <Image src={`/img/logo/${unitCode || 'BST'}.png`} alt="Business Unit Logo" width={40} height={40} />
  </div>
)

// --- Komponen Kartu Wrapper (Solusi DRY) ---
const FeedbackCard: React.FC<React.PropsWithChildren<{ unitCode?: string }>> = ({ children, unitCode }) => (
  <div className="w-full max-w-lg mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center overflow-hidden">
    <LogoContainer unitCode={unitCode} />
    <div className="p-4 sm:p-6 lg:p-8 pt-0 w-full text-center">{children}</div>
  </div>
)

// --- Komponen Step 1: Form Gabungan ---
interface FeedbackFormScreenProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  suggestion: string
  setSuggestion: (s: string) => void
  processing: boolean
  onRatingSelect: (rating: number) => void
  selectedRating: number | null
}

const FeedbackFormScreen: React.FC<FeedbackFormScreenProps> = ({
  onSubmit,
  suggestion,
  setSuggestion,
  processing,
  onRatingSelect,
  selectedRating
}) => {
  const ratings = [
    { value: 1, icon: '😠', label: 'Kecewa' },
    { value: 2, icon: '🙁', label: 'Kurang' },
    { value: 3, icon: '😐', label: 'Cukup' },
    { value: 4, icon: '🙂', label: 'Baik' },
    { value: 5, icon: '😄', label: 'Luar Biasa' }
  ]

  return (
    <form onSubmit={onSubmit}>
      {/* Bagian Rating */}
      <h1 className="text-2xl font-bold text-white mb-3">Seberapa puas Anda dengan produk dan layanan kami?</h1>
      <p className="text-gray-200 mb-8">Masukan Anda membantu kami menjadi lebih baik.</p>
      <div className="flex justify-center items-start gap-x-2 sm:gap-x-4 mb-8">
        {ratings.map(({ value, icon, label }) => (
          <div
            key={value}
            onClick={() => onRatingSelect(value)}
            className="cursor-pointer flex flex-col items-center transition-transform duration-200 hover:scale-110"
          >
            <div
              className={`text-4xl sm:text-5xl w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                selectedRating === value ? 'bg-purple-600 scale-110' : 'bg-black/20'
              }`}
            >
              {icon}
            </div>
            <p className="text-sm text-gray-300 mt-2">{label}</p>
          </div>
        ))}
      </div>

      {/* --- Bagian Saran (Sekarang Kondisional) --- */}
      {selectedRating !== null && selectedRating <= 3 && (
        <div className="mt-6 w-full">
          <h2 className="text-xl font-bold text-white mb-3">
            Mohon maaf atas ketidaknyamanannya.
            <br />
            Apa saran Anda untuk perbaikan kami?
          </h2>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            className="w-full h-32 bg-black/20 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-6"
            placeholder="Tuliskan masukan Anda di sini..."
          ></textarea>
        </div>
      )}

      {/* Tombol Submit */}
      <Button
        type="submit"
        disabled={processing || !selectedRating}
        className="w-full py-3 px-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Mengirim...' : 'Kirim Masukan'}
      </Button>
      {!selectedRating && <p className="text-yellow-300 text-sm mt-2">Pilih rating terlebih dahulu untuk mengirim.</p>}
    </form>
  )
}

// --- Komponen Step 3: Terima Kasih ---
const ThankYouScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => (
  <>
    <h1 className="text-3xl font-bold text-white mb-4">Terima Kasih!</h1>
    <p className="text-gray-200 text-lg mb-8">Kami sangat menghargai waktu yang Anda luangkan untuk memberikan masukan.</p>
    <button onClick={onDone} className="w-full py-3 px-4 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 transition-all duration-300">
      Selesai
    </button>
  </>
)

// --- Komponen App Utama ---
function App(): React.ReactElement {
  const [step, setStep] = React.useState<number>(1)

  // React Hook Form setup
  type FormValues = { rating: 1 | 2 | 3 | 4 | 5 | null; suggestion: string; unitId: string }
  const {
    handleSubmit: rhfHandleSubmit,
    setValue,
    watch,
    reset
  } = useForm<FormValues>({
    defaultValues: { rating: null, suggestion: '', unitId: '' }
  })

  // Ambil daftar unit untuk dropdown
  const { data: unitsData } = useGetAllUnits()
  const units = React.useMemo(() => unitsData?.data ?? [], [unitsData])
  const params = useParams() as { feedbackId?: string }
  const router = useRouter()
  useEffect(() => {
    if (params?.feedbackId) setValue('unitId', params.feedbackId)
  }, [params?.feedbackId, setValue])

  // Redirect ke root jika unit tidak ditemukan
  useEffect(() => {
    const currentUnitId = watch('unitId')
    if (!unitsData) return
    if (!currentUnitId) {
      router.replace('/')
      return
    }
    const exists = units.some((u) => u.id === currentUnitId)
    if (!exists) router.replace('/')
  }, [unitsData, units, watch, router])

  // React Query mutation untuk membuat feedback
  const createFeedbackMutation = useCreateFeedback()

  // Gunakan URL placeholder berkualitas tinggi untuk latar belakang
  const backgroundImageUrl = '/img/bg-bmu.png'
  const unitId = watch('unitId')
  const unitCode = units.find((u) => u.id === unitId)?.code
  const selectedRating = watch('rating')
  const suggestion = watch('suggestion')
  const processing = createFeedbackMutation.isPending
  const handleRatingClick = (rating: number) => {
    setValue('rating', rating as 1 | 2 | 3 | 4 | 5)
  }

  const handleSubmit = rhfHandleSubmit((values) => {
    // Validasi sederhana
    if (!values.rating) {
      console.warn('Rating belum dipilih.')
      return
    }
    if (!values.unitId) {
      console.warn('Unit tidak ditemukan dari params.')
      return
    }

    const payload: CreateFeedbackRequest = {
      rating: values.rating as 1 | 2 | 3 | 4 | 5,
      suggestion: values.suggestion || '',
      unitId: values.unitId
    }

    createFeedbackMutation.mutate(payload, {
      onSuccess: () => {
        setStep(2)
        reset({ rating: null, suggestion: '', unitId: values.unitId })
      },
      onError: (err) => {
        console.error('Gagal mengirim feedback', err)
      }
    })
  })

  const handleDone = () => {
    setStep(1)
    reset({ rating: null, suggestion: '', unitId })
  }

  const renderStepContent = (): React.ReactNode => {
    switch (step) {
      case 1:
        return (
          <FeedbackFormScreen
            onRatingSelect={handleRatingClick}
            selectedRating={selectedRating}
            suggestion={suggestion}
            setSuggestion={(s) => setValue('suggestion', s)}
            onSubmit={handleSubmit}
            processing={processing}
          />
        )
      case 2:
        return <ThankYouScreen onDone={handleDone} />
      default:
        return null
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 overflow-hidden"
      style={{
        backgroundImage: `url('${backgroundImageUrl}')`
      }}
    >
      <FeedbackCard unitCode={unitCode}>{renderStepContent()}</FeedbackCard>
    </div>
  )
}

export default App

'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useGetAllDivisions } from '@/hooks/api/useDivision'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateFeedbackHeadOffice } from '@/hooks/api/useFeedbackHO'
import { CreateFeedbackHeadOfficeRequest } from '@/types/api/feedbackHOType'
import { useParams, useRouter } from 'next/navigation'

// --- Komponen Logo ---
const LogoContainer = () => (
  <div className="inline-flex bg-white/95 p-4 sm:p-6 rounded-b-3xl shadow-md items-center gap-6 mb-8">
    <Image src="/img/logo/BMU.png" alt="Logo BMU" width={40} height={40} />
  </div>
)

// --- Komponen Kartu Wrapper (Solusi DRY) ---
const FeedbackCard: React.FC<React.PropsWithChildren<{ divisionName?: string }>> = ({ children }) => (
  <div className="w-full max-w-xl mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center overflow-hidden">
    <LogoContainer />
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
  divisionName?: string
}

const FeedbackFormScreen: React.FC<FeedbackFormScreenProps> = ({
  onSubmit,
  suggestion,
  setSuggestion,
  processing,
  onRatingSelect,
  selectedRating,
  divisionName
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
      <h1 className="md:text-lg text-sm font-normal leading-relaxed text-white mb-3">
        Seberapa besar Anda menilai bahwa layanan divisi <b className="text-emerald-200">{divisionName ?? 'terkait'}</b> pada Head Office PT BMU telah
        mendukung kelancaran operasional unit Anda secara optimal?
      </h1>
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
  type FormValues = { rating: 1 | 2 | 3 | 4 | 5 | null; suggestion: string; divisionId: string }
  const {
    handleSubmit: rhfHandleSubmit,
    setValue,
    watch,
    reset
  } = useForm<FormValues>({
    defaultValues: { rating: null, suggestion: '', divisionId: '' }
  })

  // Ambil daftar unit untuk dropdown
  const { data: divisionsData } = useGetAllDivisions()
  const divisions = React.useMemo(() => divisionsData?.data ?? [], [divisionsData])
  const params = useParams() as { feedbackId?: string }
  const router = useRouter()
  useEffect(() => {
    if (params?.feedbackId) setValue('divisionId', params.feedbackId)
  }, [params?.feedbackId, setValue])

  // Redirect ke root jika unit tidak ditemukan
  useEffect(() => {
    const currentDivisionId = watch('divisionId')
    if (!divisionsData) return
    if (!currentDivisionId) {
      router.replace('/feedbacks-ho')
      return
    }
    const exists = (divisions ?? []).some((d) => d.id === currentDivisionId)
    if (!exists) router.replace('/feedbacks-ho')
  }, [divisionsData, divisions, watch, router])

  // React Query mutation untuk membuat feedback
  const createFeedbackHeadOfficeMutation = useCreateFeedbackHeadOffice()

  // Gunakan URL placeholder berkualitas tinggi untuk latar belakang
  const backgroundImageUrl = '/img/bg-bmu.png'
  const divisionId = watch('divisionId')
  const divisionsName = divisions.find((d) => d.id === divisionId)?.name
  const selectedRating = watch('rating')
  const suggestion = watch('suggestion')
  const processing = createFeedbackHeadOfficeMutation.isPending
  const handleRatingClick = (rating: number) => {
    setValue('rating', rating as 1 | 2 | 3 | 4 | 5)
  }

  const handleSubmit = rhfHandleSubmit((values) => {
    // Validasi sederhana
    if (!values.rating) {
      console.warn('Rating belum dipilih.')
      return
    }
    if (!values.divisionId) {
      console.warn('Division tidak ditemukan dari params.')
      return
    }

    const payload: CreateFeedbackHeadOfficeRequest = {
      rating: values.rating as 1 | 2 | 3 | 4 | 5,
      suggestion: values.suggestion || '',
      divisionId: values.divisionId
    }

    createFeedbackHeadOfficeMutation.mutate(payload, {
      onSuccess: () => {
        setStep(2)
        reset({ rating: null, suggestion: '', divisionId: values.divisionId })
      },
      onError: (err) => {
        console.error('Gagal mengirim feedback', err)
      }
    })
  })

  const handleDone = () => {
    setStep(1)
    reset({ rating: null, suggestion: '', divisionId })
  }

  const renderStepContent = (): React.ReactNode => {
    switch (step) {
      case 1:
        return (
          <FeedbackFormScreen
            divisionName={divisionsName}
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
      <FeedbackCard>{renderStepContent()}</FeedbackCard>
    </div>
  )
}

export default App

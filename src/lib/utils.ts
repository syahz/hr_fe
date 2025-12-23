import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mengubah angka menjadi format mata uang Rupiah (IDR).
 * Contoh: 1500000 -> "Rp 1.500.000"
 * @param amount - Angka yang akan diformat.
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) {
    return 'Rp 0'
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatCurrencyTable(amount: number): string {
  if (isNaN(amount)) {
    return 'Rp 0'
  }

  return new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Memformat tanggal menjadi format tanggal Indonesia yang mudah dibaca.
 * @param dateString - String tanggal ISO atau objek Date.
 * @param withTime - Apakah akan menyertakan waktu.
 * @returns String tanggal yang diformat, contoh: "20 Oktober 2023, 09.00".
 */
export const formatDateID = (dateString: string | Date, withTime = false) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  if (withTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(dateString))
}

/**
 * Mengubah format tanggal menjadi format yang lebih mudah dibaca.
 * Contoh: "2023-10-05T14:48:00.000Z" -> "5 Oktober 2023"
 * @param dateString - String tanggal dalam format ISO.
 * @returns Tanggal dalam format "D MMMM YYYY".
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

/**
 * Memotong teks yang terlalu panjang dan menambahkan elipsis ("...") di akhir.
 * @param label - Teks yang akan dipotong.
 * @param maxLength - Panjang maksimum teks sebelum dipotong.
 * @returns Teks yang sudah dipotong jika melebihi panjang maksimum, atau teks asli jika tidak.
 */
export function truncateText(label: string, maxLength: number): string {
  if (label.length > maxLength) {
    return label.slice(0, maxLength) + '...'
  }
  return label
}

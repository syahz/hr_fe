import * as z from 'zod'

export const CreateSppValidation = z.object({
  unit_id: z.string().min(1, 'Unit wajib dipilih'),
  month: z.number().int().min(1, 'Bulan minimal 1').max(12, 'Bulan maksimal 12'),
  year: z.number().int().min(2000, 'Tahun minimal 2000').max(2100, 'Tahun maksimal 2100'),
  spp_letter: z.string().min(1, 'Nomor surat SPP wajib diisi'),
  gaji_basic_salary: z.number().min(0, 'Tidak boleh negatif'),
  nominal_thp: z.number().min(0, 'Tidak boleh negatif'),
  upah: z.number().min(0, 'Tidak boleh negatif'),
  bantuan_dana: z.number().min(0, 'Tidak boleh negatif'),
  lembur: z.number().min(0, 'Tidak boleh negatif'),
  tagihan_kjpri: z.number().min(0, 'Tidak boleh negatif'),
  pph_21_pekerja: z.number().min(0, 'Tidak boleh negatif'),
  pph_21_perusahaan: z.number().min(0, 'Tidak boleh negatif'),
  premi_bpjs_kesehatan: z.number().min(0, 'Tidak boleh negatif'),
  bpjs_kesehatan_perusahaan: z.number().min(0, 'Tidak boleh negatif'),
  bpjs_kesehatan_pekerja: z.number().min(0, 'Tidak boleh negatif'),
  bpjs_kesehatan_family: z.number().min(0, 'Tidak boleh negatif'),
  iuran_jkk: z.number().min(0, 'Tidak boleh negatif'),
  iuran_jkm: z.number().min(0, 'Tidak boleh negatif'),
  iuran_jht_tenaga_kerja: z.number().min(0, 'Tidak boleh negatif'),
  iuran_jp_tenaga_kerja: z.number().min(0, 'Tidak boleh negatif'),
  total_tagihan_tenaga_kerja: z.number().min(0, 'Tidak boleh negatif'),
  iuran_jht_perusahaan: z.number().min(0, 'Tidak boleh negatif'),
  iuran_jp_perusahaan: z.number().min(0, 'Tidak boleh negatif'),
  total_tagihan_perusahaan: z.number().min(0, 'Tidak boleh negatif'),
  total_tagihan_bpjs_ketenagakerjaan: z.number().min(0, 'Tidak boleh negatif'),
  piutang: z.number().min(0, 'Tidak boleh negatif'),
  keterangan_piutang: z.string().optional(),
  hutang: z.number().min(0, 'Tidak boleh negatif'),
  keterangan_hutang: z.string().optional(),
  bonus: z.number().min(0, 'Tidak boleh negatif'),
  keterangan_bonus: z.string().optional()
})

export type CreateSppFormValues = z.infer<typeof CreateSppValidation>

import * as z from 'zod'

export const CreateUnitVAValidation = z.object({
  unit_id: z.string().min(1, 'Unit wajib dipilih'),
  va_number: z.string().min(1, 'Nomor VA wajib diisi'),
  va_bank: z.string().min(1, 'Bank VA wajib diisi'),
  va_name: z.string().min(1, 'Nama VA wajib diisi')
})

export type CreateUnitVAFormValues = z.infer<typeof CreateUnitVAValidation>

export const UpdateUnitVAValidation = z.object({
  unit_id: z.string().optional(),
  va_number: z.string().min(1, 'Nomor VA wajib diisi').optional(),
  va_bank: z.string().min(1, 'Bank VA wajib diisi').optional(),
  va_name: z.string().min(1, 'Nama VA wajib diisi').optional()
})

export type UpdateUnitVAFormValues = z.infer<typeof UpdateUnitVAValidation>

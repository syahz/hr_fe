import * as z from 'zod'

export const CreateUnitValidation = z.object({
  name: z.string().min(1, 'Nama unit wajib diisi'),
  code: z.string().min(1, 'Kode unit wajib diisi').max(6, 'Maksimal 6 karakter')
})

export type CreateUnitFormValues = z.infer<typeof CreateUnitValidation>

export const UpdateUnitValidation = z.object({
  name: z.string().min(2, 'Nama minimal harus 2 karakter.').optional(),
  code: z.string().min(1, 'Kode unit wajib diisi').max(6, 'Maksimal 6 karakter').optional()
})

export type UpdateUnitFormValues = z.infer<typeof UpdateUnitValidation>

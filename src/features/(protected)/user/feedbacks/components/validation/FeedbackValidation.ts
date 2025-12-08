import { z } from 'zod'

export const FeedbackFormValidation = z.object({
  rating: z.string().min(1, 'Rating wajib diisi.'),
  suggestion: z.string().min(1, 'Perihal surat wajib diisi.').optional(),
  nominal: z.number('Nominal harus berupa angka.').positive('Nominal harus lebih dari 0.'),
  unitId: z.uuid('Unit wajib ada.')
})

export type FeedbackFormValues = z.infer<typeof FeedbackFormValidation>

import { z } from 'zod'

// Skema validasi menggunakan Zod
export const LoginValidation = z.object({
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string().min(1, { message: 'Password tidak boleh kosong.' })
})

// Mengekstrak tipe TypeScript dari skema Zod
export type LoginFormValues = z.infer<typeof LoginValidation>

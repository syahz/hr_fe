'use client'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'white' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      richColors
      toastOptions={{
        classNames: {
          toast: 'backdrop-blur-lg shadow-lg',
          success: '!bg-green-500/70 !text-white',
          error: '!bg-red-500 !bg-opacity-80 !border-red-500 !border-opacity-30 !text-white',
          warning: '!bg-amber-500 !bg-opacity-80 !border-amber-500 !border-opacity-30 !text-white',
          info: '!bg-blue-500 !bg-opacity-80 !border-blue-500 !border-opacity-30 !text-white',
          loading: '!bg-gray-500 !bg-opacity-80 !border-gray-500 !border-opacity-30 !text-white'
        }
      }}
      {...props}
    />
  )
}

export { Toaster }

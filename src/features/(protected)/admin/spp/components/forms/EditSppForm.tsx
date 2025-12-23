'use client'

import React from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Control, FieldPath, SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { useGetSpp, useUpdateSpp } from '@/hooks/api/useSpp'
import { useGetAllUnits } from '@/hooks/api/useUnit'
import { Input } from '@/components/ui/input'

import { CreateSppValidation, CreateSppFormValues } from '../validation/SppValidation'
import type { UpdateSppRequest } from '@/types/api/spp'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'

type NumericFieldProps = {
  control: Control<CreateSppFormValues>
  name: FieldPath<CreateSppFormValues>
  label: string
  min?: number
  max?: number
  placeholder?: string
  disabled?: boolean
}

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function NumericField({ control, name, label, min, max, placeholder, disabled }: NumericFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel required>{label}</FormLabel>
          <FormControl>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>Rp</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                min={min}
                max={max}
                placeholder={placeholder}
                {...field}
                disabled={disabled}
                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface EditSppFormProps {
  id: string
  onSuccess?: () => void
}

export function EditSppForm({ id, onSuccess }: EditSppFormProps) {
  const router = useRouter()
  const { data: detail, isLoading } = useGetSpp(id)
  const updateSpp = useUpdateSpp(id)
  const { data: unitsResponse, isLoading: unitsLoading } = useGetAllUnits()

  const form = useForm<CreateSppFormValues>({
    resolver: zodResolver(CreateSppValidation),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      unit_id: '',
      month: undefined as unknown as number,
      year: undefined as unknown as number,
      nominal_thp: 0,
      upah: 0,
      bantuan_dana: 0,
      lembur: 0,
      tagihan_kjpri: 0,
      pph_21_pekerja: 0,
      pph_21_perusahaan: 0,
      premi_bpjs_kesehatan: 0,
      bpjs_kesehatan_perusahaan: 0,
      bpjs_kesehatan_pekerja: 0,
      bpjs_kesehatan_family: 0,
      iuran_jkk: 0,
      iuran_jkm: 0,
      iuran_jht_tenaga_kerja: 0,
      iuran_jp_tenaga_kerja: 0,
      total_tagihan_tenaga_kerja: 0,
      iuran_jht_perusahaan: 0,
      iuran_jp_perusahaan: 0,
      total_tagihan_perusahaan: 0,
      total_tagihan_bpjs_ketenagakerjaan: 0,
      piutang: 0,
      keterangan_piutang: '',
      hutang: 0,
      keterangan_hutang: '',
      bonus: 0,
      keterangan_bonus: ''
    }
  })

  // Seed form when detail arrives
  React.useEffect(() => {
    if (!detail) return
    const nominal_thp = Math.max((detail.upah || 0) - (detail.lembur || 0), 0)
    form.reset({
      unit_id: detail.unit.id,
      month: detail.month,
      year: detail.year,
      nominal_thp,
      spp_letter: detail.spp_letter || '',
      upah: detail.upah,
      bantuan_dana: detail.bantuan_dana,
      lembur: detail.lembur,
      tagihan_kjpri: detail.tagihan_kjpri,
      pph_21_pekerja: detail.pph_21_pekerja,
      pph_21_perusahaan: detail.pph_21_perusahaan,
      premi_bpjs_kesehatan: detail.premi_bpjs_kesehatan,
      bpjs_kesehatan_perusahaan: detail.bpjs_kesehatan_perusahaan,
      bpjs_kesehatan_pekerja: detail.bpjs_kesehatan_pekerja,
      bpjs_kesehatan_family: detail.bpjs_kesehatan_family,
      iuran_jkk: detail.iuran_jkk,
      iuran_jkm: detail.iuran_jkm,
      iuran_jht_tenaga_kerja: detail.iuran_jht_tenaga_kerja,
      iuran_jp_tenaga_kerja: detail.iuran_jp_tenaga_kerja,
      total_tagihan_tenaga_kerja: detail.total_tagihan_tenaga_kerja,
      iuran_jht_perusahaan: detail.iuran_jht_perusahaan,
      iuran_jp_perusahaan: detail.iuran_jp_perusahaan,
      total_tagihan_perusahaan: detail.total_tagihan_perusahaan,
      total_tagihan_bpjs_ketenagakerjaan: detail.total_tagihan_bpjs_ketenagakerjaan,
      piutang: detail.piutang,
      keterangan_piutang: detail.keterangan_piutang || '',
      hutang: detail.hutang,
      keterangan_hutang: detail.keterangan_hutang || '',
      bonus: detail.bonus,
      keterangan_bonus: detail.keterangan_bonus || ''
    })
  }, [detail, form])

  // Derived field calculations
  React.useEffect(() => {
    const compute = () => {
      const { premi_bpjs_kesehatan, iuran_jkk, iuran_jht_tenaga_kerja, iuran_jp_tenaga_kerja, iuran_jht_perusahaan, iuran_jp_perusahaan } =
        form.getValues()

      const base = Number(premi_bpjs_kesehatan) || 0
      form.setValue('bpjs_kesehatan_perusahaan', base * 0.8, { shouldValidate: true, shouldDirty: true })
      form.setValue('bpjs_kesehatan_pekerja', base * 0.2, { shouldValidate: true, shouldDirty: true })

      const sumtk = (Number(iuran_jkk) || 0) + (Number(iuran_jht_tenaga_kerja) || 0) + (Number(iuran_jp_tenaga_kerja) || 0)
      form.setValue('total_tagihan_tenaga_kerja', sumtk, { shouldValidate: true, shouldDirty: true })

      const sumperusahaan = (Number(iuran_jkk) || 0) + (Number(iuran_jht_perusahaan) || 0) + (Number(iuran_jp_perusahaan) || 0)
      form.setValue('total_tagihan_perusahaan', sumperusahaan, { shouldValidate: true, shouldDirty: true })
      form.setValue('total_tagihan_bpjs_ketenagakerjaan', sumtk + sumperusahaan, { shouldValidate: true, shouldDirty: true })

      const sumupah = (Number(form.getValues('nominal_thp')) || 0) + (Number(form.getValues('lembur')) || 0)
      form.setValue('upah', sumupah, { shouldValidate: true, shouldDirty: true })
    }

    // initial compute
    compute()

    const subscription = form.watch((_value, { name }) => {
      if (
        name === 'premi_bpjs_kesehatan' ||
        name === 'iuran_jkk' ||
        name === 'iuran_jht_tenaga_kerja' ||
        name === 'iuran_jp_tenaga_kerja' ||
        name === 'iuran_jht_perusahaan' ||
        name === 'iuran_jp_perusahaan' ||
        name === 'nominal_thp' ||
        name === 'lembur'
      ) {
        compute()
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit: SubmitHandler<CreateSppFormValues> = (values) => {
    // compute final upah and omit nominal_thp from payload
    const upah = (values.nominal_thp || 0) + (values.lembur || 0)
    const payload: Record<string, unknown> = { ...values, upah }
    delete (payload as { nominal_thp?: unknown }).nominal_thp
    updateSpp.mutateAsync(payload as UpdateSppRequest, {
      onSuccess: () => {
        toast.success('SPP berhasil diperbarui!')
        router.push('/admin/spp')
        onSuccess?.()
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Gagal memperbarui SPP')
      }
    })
  }

  const units = unitsResponse?.data ?? []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Ubah SPP</CardTitle>
            <CardDescription>Perbarui data berikut untuk mengubah Surat Perintah Pembayaran.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="spp_letter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Surat SPP</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="text"
                        placeholder="03.00282/SPer/BMU/XI/2025"
                        value={field.value ? String(field.value) : ''}
                        onChange={(e) => {
                          field.onChange(e.target.value)
                        }}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="unit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Unit</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} disabled={unitsLoading || isLoading}>
                        <SelectTrigger>
                          <SelectValue placeholder={unitsLoading ? 'Memuat unit…' : 'Pilih unit'} />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name} ({u.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Bulan</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value !== undefined && field.value !== null ? String(field.value) : ''}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bulan" />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS_ID.map((label, idx) => (
                            <SelectItem key={idx + 1} value={String(idx + 1)}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Tahun</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder="Contoh: 2025"
                        value={field.value ? String(field.value) : ''}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
                          field.onChange(raw === '' ? 0 : Number(raw))
                        }}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            {/* Komponen BPJS Kesehatan */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Komponen BPJS Kesehatan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NumericField control={form.control} name="premi_bpjs_kesehatan" label="Premi BPJS Kesehatan" min={0} placeholder="0" />
                <NumericField control={form.control} name="bpjs_kesehatan_family" label="BPJS Kesehatan Family" min={0} placeholder="0" />
                <NumericField
                  control={form.control}
                  name="bpjs_kesehatan_perusahaan"
                  label="Tagihan BPJS Kesehatan Perusahaan"
                  min={0}
                  placeholder="0"
                  disabled
                />
                <NumericField
                  control={form.control}
                  name="bpjs_kesehatan_pekerja"
                  label="Tagihan BPJS Kesehatan Tenaga Kerja"
                  min={0}
                  placeholder="0"
                  disabled
                />
              </div>
            </div>

            <Separator />
            {/* Komponen BPJS Ketenagakerjaan */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Komponen BPJS Ketenagakerjaan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NumericField control={form.control} name="iuran_jkk" label="Iuran JKK" min={0} placeholder="0" />
                <NumericField control={form.control} name="iuran_jkm" label="Iuran JKM" min={0} placeholder="0" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NumericField control={form.control} name="iuran_jht_tenaga_kerja" label="Iuran JHT TK" min={0} placeholder="0" />
                <NumericField control={form.control} name="iuran_jp_tenaga_kerja" label="Iuran JP TK" min={0} placeholder="0" />
                <NumericField control={form.control} name="total_tagihan_tenaga_kerja" label="Tagihan TK" min={0} placeholder="0" disabled />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NumericField control={form.control} name="iuran_jht_perusahaan" label="Iuran JHT Perusahaan" min={0} placeholder="0" />
                <NumericField control={form.control} name="iuran_jp_perusahaan" label="Iuran JP Perusahaan" min={0} placeholder="0" />
                <NumericField control={form.control} name="total_tagihan_perusahaan" label="Tagihan Perusahaan" min={0} placeholder="0" disabled />
              </div>
              <div className="grid grid-cols-1 gap-6">
                <NumericField
                  control={form.control}
                  name="total_tagihan_bpjs_ketenagakerjaan"
                  label="Total Tagihan BPJS Ketenagakerjaan"
                  min={0}
                  placeholder="0"
                  disabled
                />
              </div>
            </div>

            <Separator />
            {/* Komponen Perusahaan */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Komponen Perusahaan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NumericField control={form.control} name="nominal_thp" label="Nominal THP" min={0} placeholder="0" />
                <NumericField control={form.control} name="lembur" label="Lembur" min={0} placeholder="0" />
                <NumericField control={form.control} name="upah" label="Total Upah" min={0} placeholder="0" disabled />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NumericField control={form.control} name="bantuan_dana" label="Bantuan Dana" min={0} placeholder="0" />
                <NumericField control={form.control} name="tagihan_kjpri" label="Tagihan KJPRI" min={0} placeholder="0" />
                <NumericField control={form.control} name="pph_21_perusahaan" label="PPh 21 Perusahaan" min={0} placeholder="0" />
                <NumericField control={form.control} name="pph_21_pekerja" label="PPh 21 Tenaga Kerja" min={0} placeholder="0" />
                <NumericField control={form.control} name="piutang" label="Piutang" min={0} placeholder="0" />
                {Number(form.watch('piutang')) > 0 && (
                  <FormField
                    control={form.control}
                    name="keterangan_piutang"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keterangan Piutang</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan keterangan piutang" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <NumericField control={form.control} name="hutang" label="Hutang" min={0} placeholder="0" />
                {Number(form.watch('hutang')) > 0 && (
                  <FormField
                    control={form.control}
                    name="keterangan_hutang"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keterangan Hutang</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan keterangan hutang" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <NumericField control={form.control} name="bonus" label="Bonus" min={0} placeholder="0" />
                {Number(form.watch('bonus')) > 0 && (
                  <FormField
                    control={form.control}
                    name="keterangan_bonus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keterangan Bonus</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan keterangan bonus" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateSpp.isPending || isLoading}>
              {updateSpp.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

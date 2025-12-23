'use client'

import React from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm, Control, FieldPath } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { useCreateSpp } from '@/hooks/api/useSpp'
import { useGetAllUnits } from '@/hooks/api/useUnit'
import { Input } from '@/components/ui/input'

import { CreateSppValidation, CreateSppFormValues } from '../validation/SppValidation'
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

export function CreateSppForm() {
  const router = useRouter()
  const createSpp = useCreateSpp()
  const { data: unitsResponse, isLoading: unitsLoading } = useGetAllUnits()

  const now = new Date()
  const form = useForm<CreateSppFormValues>({
    resolver: zodResolver(CreateSppValidation),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      unit_id: '',
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      spp_letter: '',
      gaji_basic_salary: 0,
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

  // Auto-calculate derived fields via subscription
  React.useEffect(() => {
    const compute = () => {
      const { premi_bpjs_kesehatan, iuran_jkk, iuran_jkm, iuran_jht_tenaga_kerja, iuran_jht_perusahaan, iuran_jp_perusahaan, iuran_jp_tenaga_kerja } =
        form.getValues()

      const base = Number(premi_bpjs_kesehatan) || 0
      form.setValue('bpjs_kesehatan_perusahaan', base * 0.8, { shouldValidate: true, shouldDirty: true })
      form.setValue('bpjs_kesehatan_pekerja', base * 0.2, { shouldValidate: true, shouldDirty: true })

      const sumtk = (Number(iuran_jht_tenaga_kerja) || 0) + (Number(iuran_jp_tenaga_kerja) || 0)
      form.setValue('total_tagihan_tenaga_kerja', sumtk, { shouldValidate: true, shouldDirty: true })

      const sumperusahaan =
        (Number(iuran_jkk) || 0) + (Number(iuran_jkm) || 0) + (Number(iuran_jht_perusahaan) || 0) + (Number(iuran_jp_perusahaan) || 0)
      form.setValue('total_tagihan_perusahaan', sumperusahaan, { shouldValidate: true, shouldDirty: true })
      form.setValue('total_tagihan_bpjs_ketenagakerjaan', sumtk + sumperusahaan, { shouldValidate: true, shouldDirty: true })

      const sumupah = Number(form.getValues('nominal_thp')) || 0
      form.setValue('upah', sumupah, { shouldValidate: true, shouldDirty: true })
    }

    // initial compute
    compute()

    const subscription = form.watch((_value, { name }) => {
      if (
        name === 'premi_bpjs_kesehatan' ||
        name === 'iuran_jkk' ||
        name === 'iuran_jkm' ||
        name === 'iuran_jht_tenaga_kerja' ||
        name === 'iuran_jp_tenaga_kerja' ||
        name === 'iuran_jht_perusahaan' ||
        name === 'iuran_jp_perusahaan' ||
        name === 'nominal_thp'
      ) {
        compute()
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit: SubmitHandler<CreateSppFormValues> = (values) => {
    // Trim payload to API shape (exclude fields not in CreateSppRequest)
    const {
      spp_letter,
      upah,
      gaji_basic_salary,
      bantuan_dana,
      lembur,
      tagihan_kjpri,
      pph_21_pekerja,
      pph_21_perusahaan,
      premi_bpjs_kesehatan,
      bpjs_kesehatan_perusahaan,
      bpjs_kesehatan_pekerja,
      bpjs_kesehatan_family,
      iuran_jkk,
      iuran_jkm,
      iuran_jht_tenaga_kerja,
      iuran_jp_tenaga_kerja,
      total_tagihan_tenaga_kerja,
      iuran_jht_perusahaan,
      iuran_jp_perusahaan,
      total_tagihan_perusahaan,
      total_tagihan_bpjs_ketenagakerjaan,
      piutang,
      keterangan_piutang,
      hutang,
      keterangan_hutang,
      bonus,
      keterangan_bonus,
      unit_id,
      month,
      year
    } = values

    const payload = {
      spp_letter,
      upah,
      gaji_basic_salary,
      bantuan_dana,
      lembur,
      tagihan_kjpri,
      pph_21_pekerja,
      pph_21_perusahaan,
      premi_bpjs_kesehatan,
      bpjs_kesehatan_perusahaan,
      bpjs_kesehatan_pekerja,
      bpjs_kesehatan_family,
      iuran_jkk,
      iuran_jkm,
      iuran_jht_tenaga_kerja,
      iuran_jp_tenaga_kerja,
      total_tagihan_tenaga_kerja,
      iuran_jht_perusahaan,
      iuran_jp_perusahaan,
      total_tagihan_perusahaan,
      total_tagihan_bpjs_ketenagakerjaan,
      piutang,
      keterangan_piutang,
      hutang,
      keterangan_hutang,
      bonus,
      keterangan_bonus,
      unit_id,
      month,
      year
    }

    createSpp.mutateAsync(payload, {
      onSuccess: () => {
        toast.success('SPP berhasil dibuat!')
        router.push('/admin/spp')
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Gagal membuat SPP')
      }
    })
  }

  const units = unitsResponse?.data ?? []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Buat SPP Baru</CardTitle>
            <CardDescription>Lengkapi data berikut untuk membuat Surat Perintah Pembayaran.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Periode & Unit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="unit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Unit</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} disabled={unitsLoading}>
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
            <FormField
              control={form.control}
              name="spp_letter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Nomor Surat SPP</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: SPP/001/HR/2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            {/* Komponen BPJS Kesehatan */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Komponen BPJS Kesehatan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Premi BPJS Kesehatan */}
                <NumericField control={form.control} name="premi_bpjs_kesehatan" label="Premi BPJS Kesehatan" min={0} placeholder="0" />
                {/* BPJS Kesehatan Family */}
                <NumericField control={form.control} name="bpjs_kesehatan_family" label="BPJS Kesehatan Family" min={0} placeholder="0" />

                {/* BPJS Kesehatan Perusahaan */}
                <NumericField
                  control={form.control}
                  name="bpjs_kesehatan_perusahaan"
                  label="Tagihan BPJS Kesehatan Perusahaan"
                  min={0}
                  placeholder="0"
                  disabled
                />

                {/* BPJS Kesehatan TK */}
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
                {/* BPJS Ketenagakerjaan Iuran JKK */}
                <NumericField control={form.control} name="iuran_jkk" label="Iuran JKK" min={0} placeholder="0" />

                {/* BPJS Ketenagakerjaan Iuran JKM */}
                <NumericField control={form.control} name="iuran_jkm" label="Iuran JKM" min={0} placeholder="0" />
              </div>
              {/* Komponen BPJS Ketenagakerjaan Tenaga Kerja */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* BPJS Ketenagakerjaan Iuran JHT TK */}
                <NumericField control={form.control} name="iuran_jht_tenaga_kerja" label="Iuran JHT TK" min={0} placeholder="0" />
                {/* BPJS Ketenagakerjaan Iuran JP TK */}
                <NumericField control={form.control} name="iuran_jp_tenaga_kerja" label="Iuran JP TK" min={0} placeholder="0" />

                {/* BPJS Ketenagakerjaan Tagihan TK */}
                <NumericField control={form.control} name="total_tagihan_tenaga_kerja" label="Tagihan TK" min={0} placeholder="0" disabled />
              </div>
              {/* Komponen BPJS Ketenagakerjaan Perusahaan */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* BPJS Ketenagakerjaan Iuran JHT Perusahaan */}
                <NumericField control={form.control} name="iuran_jht_perusahaan" label="Iuran JHT Perusahaan" min={0} placeholder="0" />
                {/* BPJS Ketenagakerjaan Iuran JP Perusahaan */}
                <NumericField control={form.control} name="iuran_jp_perusahaan" label="Iuran JP Perusahaan" min={0} placeholder="0" />

                {/* BPJS Ketenagakerjaan Tagihan Perusahaan */}
                <NumericField control={form.control} name="total_tagihan_perusahaan" label="Tagihan Perusahaan" min={0} placeholder="0" disabled />
              </div>
              {/* Total Tagihan keseluruhan BPJS Ketenagakerjaan */}
              <div className="grid grid-cols-1 gap-6">
                {/* Total Tagihan Keseluruhan BPJS Ketenagakerjaan */}
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
              <NumericField control={form.control} name="gaji_basic_salary" label="Gaji Basic Salary" min={0} placeholder="0" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Perusahaan Upah */}
                <NumericField control={form.control} name="nominal_thp" label="Nominal THP" min={0} placeholder="0" />
                {/* Perusahaan Lembur */}
                <NumericField control={form.control} name="lembur" label="Lembur" min={0} placeholder="0" />
                {/* Perusahaan Total Upah */}
                <NumericField control={form.control} name="upah" label="Total Upah" min={0} placeholder="0" disabled />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Perusahaan Bantuan Dana */}
                <NumericField control={form.control} name="bantuan_dana" label="Bantuan Dana" min={0} placeholder="0" />
                {/* Perusahaan Tagihan KJPRI */}
                <NumericField control={form.control} name="tagihan_kjpri" label="Tagihan KJPRI" min={0} placeholder="0" />

                {/* Perusahaan PPh 21 Perusahaan */}
                <NumericField control={form.control} name="pph_21_perusahaan" label="PPh 21 Perusahaan" min={0} placeholder="0" />
                {/* Perusahaan PPh 21 TK */}
                <NumericField control={form.control} name="pph_21_pekerja" label="PPh 21 Tenaga Kerja" min={0} placeholder="0" />
                {/* Perusahaan Piutang */}
                <NumericField control={form.control} name="piutang" label="Piutang" min={0} placeholder="0" />
                {/* Keterangan Piutang (muncul jika Piutang > 0) */}
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
                {/* Perusahaan Hutang */}
                <NumericField control={form.control} name="hutang" label="Hutang" min={0} placeholder="0" />
                {/* Keterangan Hutang (muncul jika Hutang > 0) */}
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
                {/* Perusahaan Bonus */}
                <NumericField control={form.control} name="bonus" label="Bonus" min={0} placeholder="0" />
                {/* Keterangan Bonus (muncul jika Bonus > 0) */}
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
            <Button type="submit" disabled={createSpp.isPending}>
              {createSpp.isPending ? 'Menyimpan...' : 'Simpan SPP'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

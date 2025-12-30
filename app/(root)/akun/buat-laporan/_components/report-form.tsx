'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FieldError, useForm } from 'react-hook-form'
import z from 'zod'
import Spinner from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { CheckCircle, Plus, Search, Upload } from 'lucide-react'
import { RadioCardGroup } from '@/components/shared/radiocard'
import { reportCreateSchema } from '@/lib/validations/report-validation'
import { useCreateReport } from '@/hooks/useReports'
import { useCategories } from '@/hooks/useCategories'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea'

type reportData = z.infer<typeof reportCreateSchema>

const ReportForm = () => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>()
  const { data: categories, isLoading: categoryLoading } = useCategories()

  const [lat, setLat] = useState(-7.803974)
  const [lng, setLng] = useState(110.370732)

  const LocationPicker = dynamic(() => import("./location-picker"), {
    ssr: false,
    loading: () => <div className="h-[300px] flex items-center justify-center">Loading map…</div>,
  })

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<reportData>({
    resolver: zodResolver(reportCreateSchema)
  })

  const {
    ref: registerRef,
    ...imageRegister
  } = register("image_url", {
    onChange: (e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>)
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    setFile(f)
    setPreview(URL.createObjectURL(f))

    setValue("image_url", [f], { shouldValidate: true })
  }

  const createReportMutation = useCreateReport()

  const submitChange = (data: reportData) => {
    createReportMutation.mutate(data, {
      onSuccess: async () => {
        toast.success("Laporan berhasil dibuat")
        router.replace("/akun")
      },
      onError: (err) => {
        toast.error(err.message || "Gagal membuat laporan")
      }
    })
  }

  return (
    <div className="border shadow-md rounded-md bg-white">
      <div className="p-4">
        <h3 className="font-semibold text-xl mb-1">Buat Laporan Baru</h3>
        <p className="text-gray-500 text-sm">Mohon berikan detail selengkap mungkin untuk meningkatkan peluang terjadinya pencocokan.</p>
      </div>
      <Separator />
      <form onSubmit={handleSubmit(submitChange)}>
        <div className="p-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='col-span-2'>
            <Label className="mb-1">Tipe Laporan</Label>
            <p className="mb-4 text-sm text-gray-500 ">Apakah anda melaporkan barang yg hilang atau menemukan barang</p>
            <Controller
              name="status"
              control={control}
              defaultValue="hilang"
              render={({ field }) => (
                <RadioCardGroup
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    {
                      value: "hilang",
                      label: "Kehilangan sesuatu",
                      icon: <Search className="w-5 h-5" />,
                    },
                    {
                      value: "ditemukan",
                      label: "Menemukan sesuatu",
                      icon: <CheckCircle className="w-5 h-5" />,
                    },
                  ]}
                />
              )}
            />
          </div>
          <div className="col-span-2 border-b border-t py-3">
            <Label className="mb-1">Informasi Sederhana</Label>
            <p className="mb-1 text-sm text-gray-500 ">Barang apa yg hilang/ditemukan dan kapan waktu kejadiannya</p>
          </div>
          <div className='col-span-2 md:col-span-1'>
            <Label className="mb-3">Nama barang</Label>
            <Input {...register("title")} type="text" placeholder="Masukkan nama barang" />
            {errors.title && <p className="text-red-600 text-[13px] mt-1">{errors.title.message}</p>}
          </div>
          <div className='col-span-2 md:col-span-1'>
            <Label className="mb-3">Tanggal</Label>
            <Input
              type="date"
              {...register("report_date")}
            />
            {errors.report_date && <p className="text-red-600 text-[13px] mt-1">{errors.report_date.message}</p>}
          </div>
          <div className='col-span-2'>
            <Label className="mb-3">Kategori</Label>
            <Controller
              name="id_category"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categoryLoading ? (
                    <>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-lg" />
                      ))}
                    </>
                  ) : (
                    categories?.map((cat) => {
                      const active = field.value === cat.id
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => field.onChange(cat.id)}
                          className={`
                            px-3 py-2 rounded-lg border text-sm transition
                            ${active
                              ? "border-primary bg-green-50 text-primary"
                              : "border-gray-200 hover:border-gray-400"}
                          `}
                        >
                          {cat.name}
                        </button>
                      )
                    })
                  )}
                </div>
              )}
            />
            {errors.id_category && (
              <p className="text-red-600 text-[13px] mt-2">{errors.id_category.message}</p>
            )}
          </div>
          <div className="col-span-2 border-b border-t py-3">
            <Label className="mb-1">Bukti Visual</Label>
            <p className="mb-1 text-sm text-gray-500 ">Unggah foto untuk mempermudah identifikasi barang</p>
          </div>
          <div className="upload-photo col-span-2 md:col-span-1">
            <div
              onClick={() => inputRef.current?.click()}
              className="group cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed w-full min-h-[130px] md:min-h-[120px] border-gray-300 p-6 text-center transition hover:border-primary hover:bg-gray-50" >
              {preview ? (
                <Image src={preview} alt="Preview" width={80} height={0} className="rounded" />
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Upload className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 font-semibold">Tekan untuk upload</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    SVG, PNG, JPG, atau GIF (Maksimal Ukuran 5MB)
                  </p>
                </>
              )}
              <input
                {...imageRegister}
                ref={(el) => {
                  registerRef(el)
                  inputRef.current = el
                }}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
            {errors.image_url && typeof errors.image_url === 'object' && 'message' in errors.image_url && (
              <p className="text-red-600 text-[13px] mt-1">{(errors.image_url as FieldError).message}</p>
            )}
          </div>
          <div className='col-span-2'>
            <Label className="mb-3">Deskripsi</Label>
            <Textarea
              className='h-[100px]'
              {...register('description')}
              id="description"
              placeholder="Masukkan deskripsi barang"
            />
            {errors.description && <p className="text-red-600 text-[13px] mt-1">{errors.description.message}</p>}
          </div>
          <div className="col-span-2 border-b border-t py-3">
            <Label className="mb-1">Lokasi</Label>
            <p className="mb-1 text-sm text-gray-500 ">Tandai titik di map dimana barang hilang atau ditemukan</p>
          </div>
          <div className='col-span-2'>
            <Label className="mb-3">Lokasi Lengkap</Label>
            <Input {...register("location_text")} type="text" placeholder="Masukkan lokasi lengkap" />
            {errors.location_text && <p className="text-red-600 text-[13px] mt-1">{errors.location_text.message}</p>}
          </div>
          <div className="col-span-2">
            {lat && lng && (
                <p className="text-sm text-gray-600 mb-1">
                Koordinat: {lat.toFixed(6)}, {lng.toFixed(6)}
                </p>
            )}
            <LocationPicker
              lat={lat}
              lng={lng}
              onChange={(lat, lng) => {
                setLat(lat)
                setLng(lng)
                setValue("latitude", lat)
                setValue("longitude", lng)
              }}
            />
          </div>
        </div>
        <Separator />
        <div className="flex justify-end gap-2 p-4">
          <Button variant="ghost" type="button" onClick={() => reset()} disabled={createReportMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={createReportMutation.isPending}>
            Simpan {createReportMutation.isPending && <span className="ml-2"><Spinner /></span>}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReportForm

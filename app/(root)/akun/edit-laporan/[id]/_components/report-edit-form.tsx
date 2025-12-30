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
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { CheckCircle, Search, Upload } from 'lucide-react'
import { RadioCardGroup } from '@/components/shared/radiocard'
import { reportEditSchema } from '@/lib/validations/report-validation'
import { useFindReport, useUpdateReport } from '@/hooks/useReports'
import { useCategories } from '@/hooks/useCategories'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea'

type reportData = z.infer<typeof reportEditSchema>

const ReportEditForm = ({ id_item }: { id_item: string }) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { data: report, isLoading } = useFindReport(id_item)
  const updateReportMutation = useUpdateReport()
  const { data: categories, isLoading: categoryLoading } = useCategories()

  const [preview, setPreview] = useState<string>()
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)

  const LocationPicker = dynamic(() => import("./location-edit-picker"), { ssr: false })

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<reportData>({
    resolver: zodResolver(reportEditSchema),
  })

  useEffect(() => {
    if (!report) return

    reset({
      title: report.title,
      description: report.description,
      id_category: report.id_category,
      location_text: report.location_text,
      latitude: report.latitude,
      longitude: report.longitude,
      status: report.status,
      report_date: new Date(report.report_date).toISOString().slice(0, 10),
    })

    setLat(report.latitude)
    setLng(report.longitude)
    setPreview(report.image_url)
  }, [report, reset])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    setPreview(URL.createObjectURL(f))
    setValue("image_url", [f], { shouldValidate: true })
  }

  const submitChange = (data: reportData) => {
    updateReportMutation.mutate(
      { id_item, payload: data },
      {
        onSuccess: () => {
          toast.success("Laporan berhasil diperbarui")
          router.replace("/akun")
        },
        onError: (err: unknown) => {
          let message = "Gagal memperbarui laporan"

          if (err instanceof Error) {
            message = err.message
          }

          toast.error(message)
        },
      }
    )
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
              <p className="text-red-600 text-[13px] mt-1">{errors.id_category.message}</p>
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
              <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
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
              lat={lat ?? 0}
              lng={lng ?? 0}
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
          <Button variant="ghost" type="button" onClick={() => reset()} disabled={updateReportMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateReportMutation.isPending}>
            Simpan {updateReportMutation.isPending && <span className="ml-2"><Spinner /></span>}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReportEditForm

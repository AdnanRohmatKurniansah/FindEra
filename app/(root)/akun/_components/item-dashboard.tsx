import DeleteConfirmationDialog from '@/components/shared/delete-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useDeleteReport } from '@/hooks/useReports'
import { formatMonthYear, getLastLocationPart } from '@/lib/utils'
import { itemData } from '@/types'
import { Calendar, Edit2Icon, EyeIcon, MapPin, Search, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

const ItemDashboard = ({ item }: {item: itemData}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const deleteMutation = useDeleteReport()

  const handleDelete = () => {
    if (!selectedId) return

    deleteMutation.mutate(selectedId, {
      onSuccess: () => {
        toast.success("Laporan berhasil dihapus")
        setOpenDialog(false)
        setSelectedId(null)
      },
      onError: () => {
        toast.error("Gagal menghapus laporan")
      },
    })
  }

  return (
    <div className="group block h-full">
      <Card className="overflow-hidden h-full gap-0 py-0 hover:shadow-md transition-shadow">
        <div className="relative w-full aspect-4/3 rounded-t-md overflow-hidden">
          <Link href={`/item/${item.id}`}>
            <Image alt={item.title} src={item.image_url} fill className="object-cover transition-transform duration-300 group-hover:scale-105"/>
          </Link>
          <div className="absolute left-2 top-2">
            {item.status == 'hilang' ? (
              <Badge className="px-2 py-1 bg-red-500 font-bold">
                <Search className="w-3 me-1" /> Hilang
              </Badge>
            ): (
              <Badge className="px-2 py-1 bg-blue-500 font-bold">
                <Search className="w-3 me-1" /> Ditemukan
              </Badge>
            )}
          </div>
          <div className="absolute right-2 top-2">
            <Badge className="px-2 py-1 bg-black-transparent">
                <Calendar className="w-3 me-1" /> {formatMonthYear(item.report_date)}
            </Badge>
          </div>
          <div className="absolute left-2 bottom-2">
            <Badge className="px-2 py-1 bg-white-transparent text-gray-600">
                <MapPin className='w-4 me-1 text-primary' />{getLastLocationPart(item.location_text)}
            </Badge>
          </div>
        </div>
        <div className='px-4 py-2'>
          <h4 className="font-medium text-md mt-1">{item.title}</h4>
          <p className="text-sm text-muted-foreground mt-2 flex items-center pb-2">
            {item.description.length > 50
              ? item.description.slice(0, 50) + '...'
              : item.description}
          </p>
          <div className="flex text-center items-center gap-3 pt-2 border-t">
            <Button className='bg-blue-500 hover:bg-blue-500' asChild>
                <Link href={`/akun/edit-laporan/${item.id}`}><Edit2Icon /></Link>
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-500"
              onClick={() => {
                setSelectedId(item.id)
                setOpenDialog(true)
              }}
            >
              <Trash2Icon />
            </Button>
            <Button asChild>
                <Link href={`/item/${item.id}`}><EyeIcon /></Link>
            </Button>
         </div>
        </div>
      </Card>

      <DeleteConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}


export default ItemDashboard
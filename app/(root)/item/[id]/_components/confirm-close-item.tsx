'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

const ConfirmCloseItem = ({ open, onClose, onConfirm, isLoading }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Tutup Laporan</DialogTitle>
          <DialogDescription className="text-gray-500">
            Apakah kamu yakin ingin menutup proses pencarian ini? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            Ya, Lanjutkan
            {isLoading && <span className="ml-2"><Spinner /></span>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmCloseItem

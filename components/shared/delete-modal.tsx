'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import Spinner from '../ui/spinner'
import { Button } from '../ui/button'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, isLoading }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apakah anda yakin ingin menghapus?</DialogTitle>
          <DialogDescription className="text-gray-500">
            Ini akan menghapus permanen item ini dari sistem
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Kembali</Button>
          <Button className='bg-red-600 hover:bg-red-600' onClick={onConfirm} disabled={isLoading}>
            Hapus
            {isLoading && <span className='ml-2'><Spinner /></span>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
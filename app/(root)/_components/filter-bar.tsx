import { Button } from '@/app/components/ui/button'
import { Funnel } from 'lucide-react'

const FilterBar = () => {
  const categories = [
    { value: 'semua', label: 'Semua' },
    { value: 'dompet', label: 'Dompet' },
    { value: 'hp', label: 'HP' },
    { value: 'kunci', label: 'Kunci' },
    { value: 'tas', label: 'Tas' },
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'dokumen', label: 'Dokumen' },
    { value: 'perhiasan', label: 'Perhiasan' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  return (
    <div className='filterbar bg-white shadow px-4 py-3 relative'>
        <div className="flex gap-3 overflow-x-scroll pb-1">
            <Button className='border shadow' variant={'outline'}>
                <Funnel className='ps-2' /> Filter:
            </Button>
            <Button className='border shadow'>Semua</Button>
            <Button className='border shadow' variant={'outline'}>Hilang</Button>
            <Button className='border shadow' variant={'outline'}>Ditemukan</Button>

            <>
            <Button className='border shadow'>Semua</Button>
            {categories.map((category, i) => {
                return (
                    <Button key={i} className='border shadow' value={category.value} variant={'outline'}>{category.label}</Button>
                )   
            })}
            </>
        </div>
    </div>
  )
}

export default FilterBar
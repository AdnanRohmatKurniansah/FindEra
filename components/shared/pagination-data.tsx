import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const PaginationData = ({ page, totalPages, onPageChange }: Props) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(page - 1, 1))}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1
          return (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => onPageChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        })}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}


export default PaginationData
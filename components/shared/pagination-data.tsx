import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

const PaginationData = () => {
  return (
    <Pagination>
        <PaginationContent>
            <PaginationItem>
            <PaginationPrevious href="#" size={undefined} />
            </PaginationItem>
            <PaginationItem>
            <PaginationLink href="#" size={undefined}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
            <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
            <PaginationNext href="#" size={undefined} />
            </PaginationItem>
        </PaginationContent>
    </Pagination>
  )
}

export default PaginationData
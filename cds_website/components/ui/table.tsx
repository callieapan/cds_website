import Link from 'next/link'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  

import { formatQuestionAnswer } from '@/lib/utils';
import { InterviewData
 } from '@/app/lib/definitions';

 interface InterviewTableProps {
    interviews: InterviewData[]
    currentPage: number
    totalPages: number
    totalItems: number
  }


const formatDateToLocal = (dateStr: string, locale: string = 'en-US') => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric', month: 'short', year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
};



export default async function InterviewTable({ 
    // query, currentPage, totalPages, interviews }: { 
    //     query: string; currentPage: number; totalPages: number; interviews: InterviewData[] 
    //}) {
    interviews, 
    currentPage, 
    totalPages,
    totalItems 
  }: InterviewTableProps){
    const itemsPerPage = 15
    const startIndex = (currentPage - 1) * itemsPerPage



    // // Function to render pagination buttons using anchor tags
    // const renderPagination = () => {
    //     const pages = [];
    //     for (let i = 1; i <= totalPages; i++) {
    //         pages.push(
    //             <a key={i}
    //                href={`/?page=${i}&query=${encodeURIComponent(query)}`}
    //                className={`px-3 py-1 ${currentPage === i ? 'text-blue-500' : 'text-gray-500'}`}
    //             >
    //                 {i}
    //             </a>
    //         );
    //     }
    //     return <div>{pages}</div>;
    // };

    // Generate page numbers to show
    const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
    // Show all pages if total pages is less than max visible
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
    }
    } else {
    // Always show first page
    pages.push(1)
    
    if (currentPage > 3) {
        pages.push('ellipsis')
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
    }
    
    if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
    }
    
    // Always show last page
    if (totalPages > 1) {
        pages.push(totalPages)
    }
    }
    
    return pages
    };

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="min-w-full text-gray-900">
                        <thead className="text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Date</th>
                                <th scope="col" className="px-3 py-5 font-medium">Company</th>
                                <th scope="col" className="px-3 py-5 font-medium">Position</th>
                                <th scope="col" className="px-3 py-5 font-medium">Round</th>
                                <th scope="col" className="px-3 py-5 font-medium">Interview Experience</th>
                                <th scope="col" className="px-3 py-5 font-medium">CDS Alumn</th>
                                <th scope="col" className="px-3 py-5 font-medium">CDS Alum Contact Info</th>
                            </tr>
                        </thead>
                        {interviews?.map((row, index) => (
                            <tbody key={index} className="bg-white">
                                <tr key={row.entry_id} className="border-b py-3 text-sm last:border-none">
                                    <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(row.date)}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{row.company}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{row.position}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{row.round}</td>
                                    <td className="whitespace-normal px-3 py-3" style={{ width: '200px' }}>{formatQuestionAnswer(row.questionanswer)}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{row.username}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{row.contactinfo}</td>
                                </tr>
                            
                            </tbody>
                        ))}
                    </table>

                </div>
            </div>
            {totalPages > 1 && (
                <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious
                        href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                    </PaginationItem>

                    {getPageNumbers().map((pageNum, index) => (
                    <PaginationItem key={index}>
                        {pageNum === 'ellipsis' ? (
                        <PaginationEllipsis />
                        ) : (
                        <PaginationLink
                            href={`?page=${pageNum}`}
                            isActive={currentPage === pageNum}
                        >
                            {pageNum}
                        </PaginationLink>
                        )}
                    </PaginationItem>
                    ))}

                    <PaginationItem>
                    <PaginationNext
                        href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
                        aria-disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                    </PaginationItem>
                </PaginationContent>
                </Pagination>
            )}

            <div className="text-sm text-muted-foreground text-center">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
            </div>

        </div>
    );
}

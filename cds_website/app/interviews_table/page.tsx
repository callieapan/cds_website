
import Search from '../../components/ui/search'
import InterviewTable from '@/components/ui/table';
import { Suspense } from 'react';
import { fetchTotalItems, fetchFilteredInterviews } from "@/app/lib/data";

export default async function Page(props: { // why does this one have props? while other function fetchFilteredIntervew just takes in the params
    searchParams?: Promise<{ // why is here Promise
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const ITEMS_PER_PAGE = 15;
    
    const totalItems = await fetchTotalItems(); // Fetch total items from the database
    const totalPages = Math.ceil(Number(totalItems) / ITEMS_PER_PAGE);
    const interviews = await fetchFilteredInterviews(query, currentPage, ITEMS_PER_PAGE);
    

    return (
        <main>
            


            <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`text-2xl`}>Interviews</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search by company name..." />
            
            </div>
            <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
                <InterviewTable  interviews={interviews} currentPage={currentPage} totalPages={totalPages} totalItems={Number(totalItems)} />
            </Suspense>
            </div>
        </main>
      );

}   


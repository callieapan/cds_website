
import Search from '../../components/ui/search'
import InterviewTable from '@/components/ui/table';
import { Suspense } from 'react';
import { fetchTotalApprovedItems, fetchFilteredInterviews } from "@/app/lib/data";
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default async function Page(props: { 
    searchParams?: Promise<{  
        query?: string;
        page?: string;
    }>;
}) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query || ''; // If searchParams or query is undefined, use ''
    const currentPage = Number(searchParams?.page) || 1; // If searchParams or page is undefined, use 1
    const ITEMS_PER_PAGE = 15;
    const totalItems = await fetchTotalApprovedItems(); // Fetch total items from the database
    const totalPages = Math.ceil(Number(totalItems) / ITEMS_PER_PAGE);
    const interviews = await fetchFilteredInterviews(query, currentPage, ITEMS_PER_PAGE);
    

    return (
        <main>

            <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`text-2xl`}>Interviews</h1>
                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block">
                    <form
                    action={async () => {
                        'use server';
                        await signOut();
                    }}
                    >
                        <button
                            type="submit" 
                            className="flex h-[48px] grow items-center justify-center gap-2 
                            rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 
                            md:flex-none md:justify-start md:p-2 md:px-3">
                            <PowerIcon className="w-6" />
                            <div className="hidden md:block">Sign Out</div>
                        </button>
                    </form>
                </div>
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


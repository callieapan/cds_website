import ApproveInterviewTable from '@/components/ui/approve_interview_table';
import { fetchUnapprovedInterviews } from "@/app/lib/data";
import { Suspense } from 'react';

// Disable caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;


// Create a separate component for the table section
async function InterviewsSection() {
    const interviews_ = await fetchUnapprovedInterviews();
    
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`text-2xl`}>Unapproved Interviews</h1>
        </div>
        <ApproveInterviewTable interviews={interviews_} />
      </div>
    );
  }
  export default async function Page() {
    return (
      <main>
        <Suspense fallback={
          <div className="w-full">
            <div className="flex w-full items-center justify-between">
              <h1 className={`text-2xl`}>Loading interviews...</h1>
            </div>
          </div>
        }>
          <InterviewsSection />
        </Suspense>
      </main>
    );
  }

// export default async function Page() {
    
//     const interviews_ = await fetchUnapprovedInterviews();

//     return (


//     <main>

//         <div className="w-full">
//         <div className="flex w-full items-center justify-between">
//             <h1 className={`text-2xl`}>Unapproved Interviews</h1>
//         </div>
//             <ApproveInterviewTable interviews={interviews_} />
//         </div>
//     </main>

//     );
//   }
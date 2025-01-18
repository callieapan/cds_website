import ApproveInterviewTable from '@/components/ui/approve_interview_table';
import { fetchUnapprovedInterviews } from "@/app/lib/data";

export default async function Page() {
    
    const interviews_ = await fetchUnapprovedInterviews();

    return (
    //   <main className="flex items-center justify-center min-h-screen">
    //     <div className="w-full max-w-md">
    //        <ApproveInterviewTable interviews={interviews_} />
    //     </div>
    //   </main>

    <main>

        <div className="w-full">
        <div className="flex w-full items-center justify-between">
            <h1 className={`text-2xl`}>Unapproved Interviews</h1>
        </div>
            <ApproveInterviewTable interviews={interviews_} />
        </div>
    </main>

    );
  }
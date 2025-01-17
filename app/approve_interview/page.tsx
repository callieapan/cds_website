import ApproveInterviewTable from '@/components/ui/approve_interview_table';
import { fetchUnapprovedInterviews } from "@/app/lib/data";

export default async function Page() {
    // NOT SURE WHY IT IS SAYING AWAIT isn't okay, and to change it to async
    const interviews_ = await fetchUnapprovedInterviews();

    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
           <ApproveInterviewTable interviews={interviews_} />
        </div>
      </main>
    );
  }

import InterviewLogForm from "../components/interview-log-form";
import Link from "next/link";

export default function Page() {
    return (
        <main>

            <div className="flex items-center  justify-center mb-8">
                <p className="text-left w-2/3 mx-auto paragraph-spacing">
                Hi fellow CDS Alumni and Students, this resources is created to help our community excel in interviews and land the roles that we are happy with. Please be respectful with comments and do not write anything in mean or inappropriate. Your contribution is greatly appreciated. 
                In addition, here are a few rules: <br/> <br/>
                <span className="font-bold">Anonmity:</span><br/> <br/>
                We encourage alumni to share their experience with each other; it is optional if you want to leave your contact information or be anonymous in providing feedback. If you choose to leave your contact information, others may reach out to you for a more in depth exchange, this could be a win-win for you as well. We leave it up to you.
                <br/> <br/>
                <span className="font-bold">Confidentiality:</span><br/> <br/>
                Alumni and students are responsible for adhering to any confidential agreements or NDAs they&apos;ve signed during interviews. Please exercise judgement when sharing.
                <br/> <br/>
                <span className="font-bold">Access:</span><br/> <br/>
                We aspire to have a high quality content in this sheet; as such we&apos;re only allowing CDS alumni and students to contribute.
               
                Members of the CDS alumni council will be monitoring this sheet regularly for any negative content that may require moderation. If you see anything of concern, please email cds-alumni-council@nyu.edu with subject &apos;Interview Sharing&apos;.
                <br/> <br/>
                Once you submit an entry and recieve an email notice from CDS alumni council with a default password to view other interview experiences, please go to the{' '} 
                <Link href="/update_password" className="text-blue-600 hover:underline">
                    Update Password
                </Link>{' '} 
                page to update the default password to a personal password first. Then you can go to the {' '} 
                <Link href="/interview_table" className="text-blue-600 hover:underline">
                    View Interviews
                </Link>{' '} 
                page to view all interview experiences. Thank you.
                </p>
            </div>
            <InterviewLogForm />
        </main>
    );
} 

import Image from "next/image";
import InterviewLogForm from "../components/interview-log-form";



export default function Page() {
    return (
        <main>
            {/* Logo Section */}
            <div className="flex justify-center mb-8">
                <div className="relative w-64 h-24">
                <Image
                    src= "/CDS_logo_purple.png"
                    alt="Company Logo"
                    className="object-contain"
                    priority={true}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // Example sizes
                    
                />
                </div>
                
            </div>
            <div className="flex items-center  justify-center mb-8">
                <p className="text-left w-3/4 mx-auto">
                Hi fellow CDS Alumni and Students, this resources is created to help our community excel in interviews and land the roles that we are happy with. Please be respectful with comments and do not write anything in mean or inappropriate. Your contribution is greatly appreciated. 
                In addition, here are a few rules: <br/> <br/>
                <span className="font-bold">Anonmity:</span><br/> <br/>
                We encourage alumni to share their experience with each other; it is optional if you want to leave your contact information or be anonymous in providing feedback. If you choose to leave your contact information, others may reach out to you for a more in depth exchange, this could be a win-win for you as well. We leave it up to you.
                <br/> <br/>
                <span className="font-bold">Confidentiality:</span><br/> <br/>
                Alumni and students are responsible for adhering to any confidential agreements or NDAs they've signed during interviews. Please exercise judgement when sharing.
                <br/> <br/>
                <span className="font-bold">Access:</span><br/> <br/>
                We aspire to have a high quality content in this sheet; as such we're only allowing CDS alumni and students to contribute.
               
                Members of the CDS alumni council will be monitoring this sheet regularly for any negative content that may require moderation. If you see anything of concern, please email cds-alumni-council@nyu.edu with subject 'Interview Sharing'.
                </p>
            </div>
            <InterviewLogForm />
        </main>
    );
} 
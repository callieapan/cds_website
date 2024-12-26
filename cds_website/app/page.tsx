
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
            
            <InterviewLogForm />
        </main>
    );
} 
"use client"
import AuthContext from "@/app/auth-contexts/Applicant";
import { useContext, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { applyForJob, getJobById } from "@/lib/db-functions";
import { toast } from "sonner";

export default function JobDescription() {
    const { user, loading } = useContext(AuthContext);
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const [job, setJob] = useState<JobProps | null>(null);
    const { id } = useParams<{ id: string }>()
    
    const fetchJob = useCallback(async () => { 
        const result = await getJobById(id);
        setJob(result);           
    }, [id]);
    
    useEffect(() => { fetchJob() }, [fetchJob]);

    if(loading || !user) {
        return <p>Loading...</p>
    }

    const handleJobApply = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        if (!job) return;
        setButtonClicked(true);
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const coverLetter = formData.get('coverLetter') as string;
        const note = formData.get('note') as string;
        const result = await applyForJob(job?.doc_id, user, coverLetter, note);
        if (result.code === "job/success") {
            toast.success(result.message);
            setButtonClicked(false);
            form.reset();
        } else {
            toast.error(result.message);
            setButtonClicked(false);
        }
    }

    return (
        <main className="p-8 md:mx-auto md:w-2/3 w-full">
            
            <div className="mb-8">
                <h2 className="text-2xl mb-4 font-bold">{job?.jobTitle}</h2>
            <div>
                <p className="mb-2 text-sm text-blue-400">Closing: {job?.expiryDate}</p>
                <p className="mb-2 text-sm text-blue-400">Company: {job?.companyName}</p>
            </div>

            <p className="mb-4 opacity-60">{job?.jobDescription}</p>
            </div>

            <form className="w-full" onSubmit={handleJobApply} >
                <h2 className="text-xl text-blue-400 font-bold mb-5">Apply </h2>

                <label htmlFor="coverLetter" className="block text-sm text-gray-700 font-semibold"> Cover Letter </label>

                <textarea id="coverLetter" name="coverLetter" rows={6} className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-[1px] border-gray-300 rounded-md p-4 mb-3" required/>
                
                <label htmlFor="note" className="block text-sm text-gray-700 font-semibold"> Note to Employer (optional) </label>

                <textarea id="note" name="note" rows={3} className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-[1px] border-gray-300 rounded-md p-4" />

                <button className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded" disabled={buttonClicked}>{buttonClicked ? "Applying..." : "Apply Now"}</button>
            </form>

            
        </main>
    )
}
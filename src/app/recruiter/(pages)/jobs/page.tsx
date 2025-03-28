"use client";
import Nav from "@/app/auth-contexts/Nav";
import Link from "next/link";
import RecruiterAuthContext from "@/app/auth-contexts/Recruiter";
import { useContext, useEffect, useCallback, useState } from "react";
import { deleteJobPosting, getRecruiterJobs } from "@/lib/db-functions";
import { toast } from "sonner";

export default function Jobs() {
	const { user, loading } = useContext(RecruiterAuthContext);
	const [jobs, setJobs] = useState<JobProps[] | null>(null);

	const fetchJobs = useCallback(async () => {
		if (!user) return;
		const jobs = await getRecruiterJobs(user.id);
		setJobs(jobs);
	}, [user]);

	useEffect(() => {
		fetchJobs();
	}, [fetchJobs]);

	if (loading || !user || !jobs) {
		return <p>Loading...</p>;
	}

	return (
		<main>
			<Nav user={user} recruiter={true} />
			<div className='px-8 w-full min-h-[90vh] py-4'>
				{jobs.length === 0 ? (
					<p className='text-lg opacity-70'>You have not posted any job yet.</p>
				) : (
					<JobCard jobs={jobs} />
				)}
			</div>
		</main>
	);
}

const JobCard = ({ jobs }: { jobs: JobProps[] }) => {
	const handleDelete = async (doc_id: string) => { 
		const result = await deleteJobPosting(doc_id);
		if (result.code === "job/success") { 
			toast.success(result.message);
			window.location.reload();
		} else { 
			toast.error(result.message);
		}
	}
	return (
		<>
			<h3 className='text-xl font-semibold mb-5'>Open Jobs ({jobs?.length})</h3>

			{jobs?.map((job) => (
				<div
					className='rounded-sm border-[1px] border-gray-400 py-4 px-6 flex items-center justify-between mb-4'
					key={job.doc_id}
				>
					<p className='opacity-70'>{job.jobTitle}</p>
					<div className='flex items-center space-x-6'>
						{job.applications.length > 0 && (
							<Link
								href={`/recruiter/jobs/${job.doc_id}/applicants`}
								className=' text-blue-500 underline'
							>
								{job.applications.length} applications
							</Link>
						)}

						<button className='bg-red-500 text-white rounded-sm px-4 py-2 cursor-pointer text-xs' onClick={() => handleDelete(job.doc_id)}>
							Delete
						</button>
					</div>
				</div>
			))}
		</>
	);
};
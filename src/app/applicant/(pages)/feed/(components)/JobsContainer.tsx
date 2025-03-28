import Link from "next/link";

export default function JobsContainer({ jobs }: { jobs: JobProps[] }) {
	return (
		<div className='flex flex-col space-y-3'>
			
			{jobs.length === 0 && <p className="text-sm text-gray-500">No available jobs yet</p>}
            
			{jobs.length > 0 && jobs.map((job) => (
				<Link key={job.doc_id} href={`/applicant/jobs/${job.doc_id}`} target="_blank">
					
					<JobCard key={job.doc_id} job={job} />
				</Link>
            ))}

		
		</div>
	);
}

const JobCard = ({ job }: { job: JobProps }) => { 
	const truncateText = (text: string): string => {
		return text.length > 300 ? text.substring(0, 300) + "..." : text;
	};
	
    return (
        <div className='bg-gray-100 px-6 py-4 rounded-md hover:bg-gray-700 hover:text-white cursor-pointer'>
				<section className='flex space-x-4 items-center justify-between mb-3'>
					<div>
						<h3 className='font-semibold'>{job.jobTitle}</h3>
						<p className='text-sm opacity-60'>{job.companyName}</p>
					</div>
					<p  className='text-sm opacity-60'>
					By: {job.name}{" "}({job.companyPosition})
					</p>
				</section>

				<p className='text-sm opacity-80 mb-4'>
					{truncateText(job.jobDescription)}
				</p>

				<p className='text-xs text-red-700 text-right italic'>
					Closing: {job.expiryDate}
				</p>
			</div>
    )
}
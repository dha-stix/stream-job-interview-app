export default function AppliedJobsContainer({
	jobsApplied,
}: {
	jobsApplied: JobProps[];
}) {
	return (
		<div className='flex flex-col space-y-4'>
			{jobsApplied.map((job) => (
				<AppliedJobCard key={job.doc_id} job={job} />
			))}
		</div>
	);
}

const AppliedJobCard = ({ job }: { job: JobProps }) => {
	return (
		<section className='flex items-center justify-between bg-gray-100 px-8 py-4 rounded-md hover:shadow-md transition duration-200'>
			<div>
				<h3 className='font-semibold text-blue-500'>{job.jobTitle}</h3>
				<p className='text-xs opacity-50'>Company Name: {job.companyName}</p>
				<p className='text-xs opacity-50'>Expiry Date: {job.expiryDate}</p>
			</div>

			<button className='bg-blue-500 text-sm text-white px-4 py-2 rounded-md'>
				{job.status}
			</button>
		</section>
	);
};
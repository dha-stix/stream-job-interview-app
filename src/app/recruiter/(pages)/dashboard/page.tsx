"use client";
import Link from "next/link";
import CreateJob from "./(components)/CreateJob";
import RecruiterAuthContext from "@/app/auth-contexts/Recruiter";
import { useContext, useState } from "react";
import { useGetCalls } from "@/app/(stream)/hooks/useGetCalls";
import Nav from "@/app/auth-contexts/Nav";
import CallCard from "./(components)/CallCard";

export default function Dashboard() {
	const [showCreateJobModal, setShowCreateJobModal] = useState<boolean>(false);
	const { user, loading } = useContext(RecruiterAuthContext);
	const { upcomingCalls, ongoingCalls } = useGetCalls(user?.id as string);

	if (loading || !user) {
		return <p>Loading...</p>;
	}

	return (
		<main>
			<Nav user={user} recruiter={true} />
			<div className='px-8 py-6 w-full'>
				<div className='flex items-center w-full md:justify-center justify-between md:space-x-8 space-x-4 mb-8'>
					<section className='h-[200px] md:w-1/3 w-1/2 border-gray-700 border-[1px] p-4 rounded-md shadow-md flex flex-col items-center justify-center cursor-pointer'>
						<h3 className='font-bold text-xl mb-2'>Open Jobs</h3>
						<Link
							href='/recruiter/jobs'
							className='text-blue-500 text-center md:text-md text-sm hover:underline'
						>
							View all
						</Link>
					</section>

					<section className='h-[200px] hover:border-[1px] border-gray-700 w-1/2 md:w-1/3 bg-white p-4 rounded-md shadow-md flex flex-col items-center justify-center'>
						<h3 className='font-bold text-xl mb-2'>Post Jobs</h3>
						<button
							className='text-blue-500 text-center md:text-md text-sm'
							onClick={() => setShowCreateJobModal(true)}
						>
							Click to add new jobs
						</button>
					</section>
				</div>

				<div>
					<h2 className='font-bold text-xl mb-4'>Upcoming Calls</h2>

					{ongoingCalls?.map((call) => (
						<CallCard key={call.id} call={call} type='ongoing' />
					))}
					{upcomingCalls?.map((call) => (
						<CallCard key={call.id} call={call} type='upcoming' />
					))}

					{upcomingCalls?.length === 0 && ongoingCalls?.length === 0 && (
						<p className='text-lg opacity-70'>You have no upcoming calls.</p>
					)}
				</div>
				<CreateJob
					isOpen={showCreateJobModal}
					onClose={() => setShowCreateJobModal(false)}
					user={user as RecruiterFirebase}
				/>
			</div>
		</main>
	);
}
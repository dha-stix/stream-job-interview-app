"use client";
import AppliedJobsContainer from "./(components)/AppliedJobsContainer";
import AuthContext from "@/app/auth-contexts/Applicant";
import { useContext, useCallback, useEffect, useState } from "react";
import Nav from "../../../../auth-contexts/Nav";
import { getJobsUserAppliedFor } from "@/lib/db-functions";

export default function Applied() {
	const { user, loading } = useContext(AuthContext);
	const [jobsApplied, setJobsApplied] = useState<JobProps[]>([]);

	const fetchAppliedJobs = useCallback(async () => {
		if (!user) return;
		const result = await getJobsUserAppliedFor(user?.id);
		setJobsApplied(result);
	}, [user]);

	useEffect(() => {
		fetchAppliedJobs();
	}, [fetchAppliedJobs]);

	if (loading || !user) {
		return <p>Loading...</p>;
	}

	return (
		<main>
			<Nav user={user} />
			<div className='px-8 py-4'>
				<h2 className='text-xl font-bold mb-4'>Applied Jobs</h2>

				{jobsApplied.length === 0 ? (
					<p className='text-sm text-gray-500'>
						You have not applied to any job yet
					</p>
				) : (
					<AppliedJobsContainer jobsApplied={jobsApplied} />
				)}
			</div>
		</main>
	);
}
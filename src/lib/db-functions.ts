import db from "./firebase";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	getDoc,
	where,
	query,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore";

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

// --- 👇🏻 Recruiter functions 👇🏻 ---
export const createJobPosting = async (
	form: FormData,
	user: RecruiterFirebase
) => {
	const jobTitle = form.get("jobTitle") as string;
	const jobDescription = form.get("jobDescription") as string;
	const expiryDate = form.get("expiryDate") as string;

	const docRef = await addDoc(collection(db, "jobs"), {
		jobTitle,
		jobDescription,
		expiryDate: formatDate(expiryDate),
		applications: [],
		...user,
	});

	if (!docRef.id) {
		return { code: "job/failed", status: 500, message: "Failed to create job" };
	}

	return {
		code: "job/success",
		status: 200,
		message: "Job created successfully",
	};
};

export const deleteJobPosting = async (doc_id: string) => {
	try {
		const docRef = doc(db, "jobs", doc_id);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			return { code: "job/failed", status: 404, message: "Job does not exist" };
		}
		const { applications } = docSnap.data() as JobProps;
		for (const application of applications) {
			const applicationRef = doc(db, "applications", application.applicationId);
			await deleteDoc(applicationRef);
		}
		await deleteDoc(doc(db, "jobs", doc_id));
		return {
			code: "job/success",
			status: 200,
			message: "Job deleted successfully",
		};
	} catch (error) {
		return {
			code: "job/failed",
			status: 500,
			message: "Failed to delete job",
			error,
		};
	}
};

export const getRecruiterJobs = async (recruiterId: string) => {
	const q = query(collection(db, "jobs"), where("id", "==", recruiterId));
	const querySnapshot = await getDocs(q);
	const jobs: JobProps[] = [];
	querySnapshot.forEach((doc) => {
		jobs.push({ doc_id: doc.id, ...doc.data() } as JobProps);
	});
	return jobs;
};

export const getJobApplicants = async (jobId: string) => {
	const docRef = doc(db, "jobs", jobId);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) {
		return {
			code: "job/failed",
			status: 404,
			message: "Job does not exist",
			applicants: [],
		};
	}
	const { applications } = docSnap.data() as JobProps;
	const applicants: ApplicationProps[] = [];

	for (const application of applications) {
		const applicationRef = doc(db, "applications", application.applicationId);
		const applicationSnap = await getDoc(applicationRef);
		if (applicationSnap.exists()) {
			applicants.push({
				id: application.applicationId,
				...applicationSnap.data(),
			} as ApplicationProps);
		}
	}

	return {
		code: "job/success",
		status: 200,
		message: "Job applicants retrieved successfully",
		applicants,
	};
};

export const handleRejectApplication = async (
	application: ApplicationProps
) => {
	const applicationRef = doc(db, "applications", application.id);
	await deleteDoc(applicationRef);

	const jobRef = doc(db, "jobs", application.jobID);
	await updateDoc(jobRef, {
		applications: arrayRemove({
			applicationId: application.id,
			userId: application.user.id,
		}),
	});

	return {
		code: "job/success",
		status: 200,
		message: "Application rejected successfully",
	};
};

export const updateJobStatus = async (
	applicationId: string,
	status: ApplicationProps["status"]
) => {
	const applicationRef = doc(db, "applications", applicationId);
	await updateDoc(applicationRef, { status });
	return {
		code: "job/success",
		status: 200,
		message: "Application status updated successfully",
	};
};

// --- 👇🏻 Job Seeker functions 👇🏻 ---
export const getJobFeed = async (user: JobSeekerFirebase) => {
	const q = query(
		collection(db, "jobs"),
		where("field", "==", user.fieldOfInterest)
	);
	const querySnapshot = await getDocs(q);
	const jobs: JobProps[] = [];

	querySnapshot.forEach((doc) => {
		const data = { doc_id: doc.id, ...doc.data() } as JobProps;
		if (data.applications.some((application) => application.userId === user.id))
			return;
		jobs.push(data);
	});

	return jobs;
};

export const getJobById = async (doc_id: string) => {
	const docRef = doc(db, "jobs", doc_id);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return { doc_id, ...docSnap.data() } as JobProps;
	} else {
		return null;
	}
};

export const applyForJob = async (
	jobID: string,
	user: JobSeekerFirebase,
	coverLetter: string,
	note: string
) => {
	const jobRef = doc(db, "jobs", jobID);

	const jobSnap = await getDoc(jobRef);

	if (!jobSnap.exists()) {
		return { code: "job/failed", status: 404, message: "Job does not exist" };
	}
	const job = jobSnap.data() as JobProps;
	const alreadyApplied = job.applications.find(
		(application) => application.userId === user.id
	);

	if (alreadyApplied) {
		return {
			code: "job/failed",
			status: 400,
			message: "You have already applied for this job",
		};
	}

	const addResult = await addDoc(collection(db, "applications"), {
		jobID,
		user,
		coverLetter,
		note,
		status: "Pending",
	});

	if (!addResult.id) {
		return {
			code: "job/failed",
			status: 500,
			message: "Failed to submit application",
		};
	}

	await updateDoc(jobRef, {
		applications: arrayUnion({ applicationId: addResult.id, userId: user.id }),
	});

	return {
		code: "job/success",
		status: 200,
		message: "Application submitted successfully",
	};
};

export const getJobsUserAppliedFor = async (userId: string) => {
	//👇 Fetch all applications for the user
	const q = query(
		collection(db, "applications"),
		where("user.id", "==", userId)
	);
	const querySnapshot = await getDocs(q);
	const applications: ApplicationProps[] = querySnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	})) as ApplicationProps[];

	if (applications.length === 0) return []; // Return empty array if no applications exist

	//👇 Fetch all job documents in a single batch request
	const jobIds = applications.map((app) => doc(db, "jobs", app.jobID));
	const jobSnaps = await getDocs(query(collection(db, "jobs"), where("__name__", "in", jobIds.map((job) => job.id))));

	const jobs: JobProps[] = jobSnaps.docs.map((doc) => {
		const application = applications.find((app) => app.jobID === doc.id);
		return {
			doc_id: doc.id,
			...doc.data(),
			status: application?.status || "Unknown", // Ensure status is included
		} as JobProps;
	});

	return jobs;
};

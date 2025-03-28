"use client";
import { Loader2 } from "lucide-react";
import StreamChatUI from "../components/StreamChatUI";
import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import db from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ChatPage() {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<
		JobSeekerFirebase | RecruiterFirebase | null
	>(null);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user?.uid) {
				setUser(user);
			} else {
				return router.push("/applicant/login");
			}
		});

		return () => unsubscribe();
	}, [router]);

	const getUser = useCallback(async () => {
		if (!user) return null;
		const jobSeekerRef = doc(db, "jobSeekers", user.uid);
		const recruiterRef = doc(db, "recruiters", user.uid);
		const jobSeekerSnap = await getDoc(jobSeekerRef);
		const recruiterSnap = await getDoc(recruiterRef);

		if (jobSeekerSnap.exists()) {
			setUserData({
				id: user.uid,
				...jobSeekerSnap.data(),
			} as JobSeekerFirebase);
		} else if (recruiterSnap.exists()) {
			setUserData({
				id: user.uid,
				...recruiterSnap.data(),
			} as JobSeekerFirebase);
		} else {
			return null;
		}
	}, [user]);

	useEffect(() => {
		getUser();
	}, [getUser]);

	return (
		<div>{userData ? <StreamChatUI user={userData} /> : <ConfirmMember />}</div>
	);
}

const ConfirmMember = ()  => {
	const router = useRouter();
	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<button
				className='text-lg mb-4 p-4 bg-blue-500 text-white rounded-md'
				onClick={() => router.back()}
			>
				Go Back
			</button>

			<div className='loader'>
				<Loader2 size={48} className='animate-spin' />
			</div>
		</div>
	);
}
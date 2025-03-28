"use client";
import { tokenProvider } from "../../../../actions/stream.action";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useState, ReactNode, useEffect, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import db from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
	const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
		null
	);

	const [user, setUser] = useState<User | null>(null);
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

		const [jobSeekerSnap, recruiterSnap] = await Promise.all([
			getDoc(doc(db, "jobSeekers", user.uid)),
			getDoc(doc(db, "recruiters", user.uid)),
		]);

		if (!jobSeekerSnap.exists() && !recruiterSnap.exists()) {
			console.warn("User data not found in Firestore");
			return null;
		}

		const userObj = {
			id: user.uid,
			name: jobSeekerSnap.data()?.name || recruiterSnap.data()?.name,
			image: jobSeekerSnap.data()?.image || recruiterSnap.data()?.image,
		};

		return new StreamVideoClient({
			apiKey,
			user: userObj,
			tokenProvider: () => tokenProvider(user.uid),
		});
	}, [user]);

	useEffect(() => {
		const result = getUser();
		if (result) {
			result.then((client) => setVideoClient(client));
		}
	}, [getUser]);

	if (!videoClient)
		return (
			<div className='h-screen flex items-center justify-center'>
				<Loader2 size='32' className='mx-auto animate-spin' />
			</div>
		);

	return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};
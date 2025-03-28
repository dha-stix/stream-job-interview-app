"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import db from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface JobSeekerContextType {
	user: JobSeekerFirebase | null;
	loading: boolean;
}

const AuthContext = createContext<JobSeekerContextType>({
	user: null,
	loading: true,
});

export function AuthProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<JobSeekerFirebase | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user?.uid) {
				setUser(user);
				setLoading(false);
			} else {
				return router.push("/applicant/login");
			}
		});

		return () => unsubscribe();
	}, [router]);

	const getUser = useCallback(async () => {
		if (!user) return null;
		const userRef = doc(db, "jobSeekers", user.uid);
		const docSnap = await getDoc(userRef);
		if (docSnap.exists()) {
			setUserData({ id: user.uid, ...docSnap.data() } as JobSeekerFirebase);
		} else {
			return null;
		}
	}, [user]);

	useEffect(() => {
		getUser();
	}, [getUser]);

	return (
		<>
			<AuthContext.Provider value={{ loading, user: userData }}>
				{children}
			</AuthContext.Provider>
		</>
	);
}

export default AuthContext;
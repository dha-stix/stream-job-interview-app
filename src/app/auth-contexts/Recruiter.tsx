"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import db from "@/lib/firebase";

const RecruiterAuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
});

export function RecruiterAuthProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<RecruiterFirebase | null>(null);
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
		const userRef = doc(db, "recruiters", user.uid);
		const docSnap = await getDoc(userRef);
		if (docSnap.exists()) {
			setUserData({ id: user.uid, ...docSnap.data() } as RecruiterFirebase);
		} else {
			return null;
		}
	}, [user]);

	useEffect(() => {
		getUser();
	}, [getUser]);

	return (
		<>
			<RecruiterAuthContext.Provider value={{ loading, user: userData }}>
				{children}
			</RecruiterAuthContext.Provider>
		</>
	);
}

export default RecruiterAuthContext;
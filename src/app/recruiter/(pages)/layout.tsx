import type { Metadata } from "next";
import { RecruiterAuthProvider } from "@/app/auth-contexts/Recruiter";
import { StreamVideoProvider } from "@/app/(stream)/providers/StreamVideoProvider";

export const metadata: Metadata = {
	title: "Recruiter Authentication | Jobber",
	description: "Sign in to your recruiter account on Jobber",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<RecruiterAuthProvider>
			<StreamVideoProvider>
				<main className='w-full min-h-screen'>{children}</main>
			</StreamVideoProvider>
		</RecruiterAuthProvider>
	);
}
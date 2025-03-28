import type { Metadata } from "next";
import { AuthProvider } from "@/app/auth-contexts/Applicant";

export const metadata: Metadata = {
	title: "Job Applicant | Jobber",
	description: "Dashboard for job applicants on Jobber",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<main className='w-full h-full'>
			<AuthProvider>
				{children}
			</AuthProvider>
			

		</main>
	);
}
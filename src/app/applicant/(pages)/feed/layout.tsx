import { StreamVideoProvider } from "@/app/(stream)/providers/StreamVideoProvider";
import type { Metadata } from "next";


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
		<StreamVideoProvider>
		<main className='w-full h-full'>
				{children}
			</main>
		</StreamVideoProvider>
		
	);
}
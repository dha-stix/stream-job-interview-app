import type { Metadata } from "next";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export const metadata: Metadata = {
	title: "Job Applicant | Jobber",
	description: "Jobber is a platform that connects job seekers with employers.",
};
export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className='w-full min-h-screen flex items-start justify-between'>
			<nav className='w-1/4 h-screen md:block hidden'>
				<div className='w-1/4 bg-blue-500 h-screen md:block hidden fixed top-0 z-10 p-8'>
					<section className='absolute bottom-20 flex flex-col'>
						<Link href='/' className='font-bold text-2xl text-gray-50 mb-3'>
							Jobber
						</Link>
						<Link
							href='/recruiter/login'
							className='opacity-50 flex space-x-2 items-center hover:opacity-100'
						>
							Recruiter Sign-in <MoveRight />
						</Link>
					</section>
				</div>
			</nav>

			{children}
		</main>
	);
}
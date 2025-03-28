"use client";
import { authLogout } from "@/lib/auth-functions";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Nav({
	user,
	recruiter,
}: {
	user: JobSeekerFirebase | RecruiterFirebase;
	recruiter?: boolean;
}) {
	const router = useRouter();

	const handleLogOut = async () => {
		const { status, message } = await authLogout();
		if (status === 200) {
			toast.success(message);
			router.push("/applicant/login");
		} else {
			toast.error(message);
		}
	};

	return (
		<nav className='w-full h-[10vh] flex border-b-[1px] border-gray-200 items-center justify-between px-8 py-2 top-0 sticky z-10 bg-white'>
			<Link
				href='/'
				className='text-2xl font-bold text-blue-700 hover:text-blue-500'
			>
				Jobber
			</Link>

			<div className='flex items-center space-x-6'>
				{!recruiter && (
					<Link
						href='/applicant/jobs/applied'
						className='opacity-60 font-bold hover:underline'
					>
						Jobs Status
					</Link>
				)}

				{!recruiter ? (
					<Link
						href={`/applicant/${user.id}`}
						target='_blank'
						className='opacity-60 text-sm hover:underline'
					>
						{user.name}
					</Link>
				) : (
					<p className='opacity-60 text-sm'>{user.name}</p>
				)}

				<button
					className='bg-red-500 text-white rounded-sm px-4 py-3 cursor-pointer'
					onClick={handleLogOut}
				>
					Logout
				</button>
			</div>
		</nav>
	);
}
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserProfile } from "@/lib/auth-functions";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
	const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<JobSeekerFirebase | null>(null);
	const router = useRouter();

	const fetchProfile = useCallback(async () => {
		const { user } = await getUserProfile(id);
		if (!user) {
			toast.error("Invalid ID", {
				description: "User not found",
			});
			return router.back();
		}
		setUser(user);
	}, [id, router]);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	return (
		<main className='w-full h-screen flex flex-col items-center justify-center'>
			<Avatar className='w-20 h-20 mb-2'>
				<AvatarImage src={user?.image} alt='@shadcn' />
				<AvatarFallback>{user?.name}</AvatarFallback>
			</Avatar>

			<h1 className='text-2xl font-bold'>{user?.name}</h1>
			<p className=' text-gray-500 font-bold'>{user?.bio}</p>
			<p className='text-sm text-blue-400'>{user?.email}</p>
			<p className='text-sm text-gray-400'>{user?.fieldOfInterest}</p>

			<section className='flex items-center justify-between space-x-6 mt-6'>
				<Link
					href={`${user?.portfolioUrl}`}
					target='_blank'
					className='bg-blue-400 hover:bg-blue-600 text-white rounded-sm px-4 py-3 cursor-pointer'
				>
					View Portfolio
				</Link>
				<Link
					href={`${user?.cv}`}
					target='_blank'
					className='bg-blue-400 hover:bg-blue-600 text-white rounded-sm px-4 py-3 cursor-pointer'
				>
					Download CV
				</Link>
			</section>
		</main>
	);
}
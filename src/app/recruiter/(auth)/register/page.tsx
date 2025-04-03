"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fields } from "@/lib/utils";
import { recruiterSignUp } from "@/lib/auth-functions";

export default function Register() {
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setButtonClicked(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		const result = await recruiterSignUp(formData);
		if (result.user) {
			toast.success("Authentication Successful", {
				description: result.message,
			});
			setButtonClicked(false);
			router.push("/recruiter/login");
		} else {
			toast.error("Authentication Failed", {
				description: result.message,
			});
			setButtonClicked(false);
		}
	};

	return (
		<section className='md:w-3/4 w-full h-full flex flex-col justify-center md:px-8 px-6 py-8 '>
			<h2 className='text-3xl font-bold mb-3 md:text-left text-center'>
				Recruiter Registration
			</h2>
			<form className='w-full' onSubmit={handleSubmit}>
				<label htmlFor='name' className='mb-2 opacity-60  '>
					Full Name
				</label>
				<input
					required
					type='text'
					id='name'
					name='name'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3  '
				/>
				<label htmlFor='email' className='mb-2 opacity-60  '>
					Email Address
				</label>
				<input
					required
					type='email'
					id='email'
					name='email'
					className='  w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='companyName' className='mb-2 opacity-60  '>
					Company Name
				</label>
				<input
					required
					type='text'
					id='companyName'
					name='companyName'
					className='  w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>
				<label htmlFor='companyPosition' className='mb-2 opacity-60  '>
					Position
				</label>
				<input
					required
					type='text'
					id='companyPosition'
					name='companyPosition'
					className='  w-full px-4 py-3 border-[1px] rounded-md mb-3'
					placeholder='e.g. HR Manager, CEO, etc'
				/>

				<label htmlFor='url' className='mb-2 opacity-60  '>
					Company Website
				</label>
				<input
					required
					type='url'
					id='url'
					name='url'
					className='  w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='field' className='mb-2 opacity-60  '>
					Company Field
				</label>
				<select
					id='field'
					required
					name='field'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3  '
				>
					{fields.map((field) => (
						<option key={field.value} value={field.value}>
							{field.name}
						</option>
					))}
				</select>

				<label htmlFor='password' className='mb-2 opacity-60  '>
					Password
				</label>
				<input
					required
					type='password'
					id='password'
					name='password'
					minLength={8}
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2  '
				/>

				<label htmlFor='image' className='mb-2 opacity-60  '>
					Headshot
				</label>
				<input
					required
					type='file'
					name='image'
					accept='image/png, image/jpeg'
					id='image'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2  '
				/>

				<button
					className='mt-2 mb-2 text-lg text-white rounded-md bg-blue-500 w-full px-8 py-4 cursor-pointer hover:bg-blue-600'
					disabled={buttonClicked}
				>
					{buttonClicked ? "Registering..." : "Register"}
				</button>
				<p className=' opacity-60 text-center'>
					Already have an account? {" "}
					<Link href='/recruiter/login' className='text-blue-800'>
						Sign in
					</Link>
				</p>
			</form>
		</section>
	);
}
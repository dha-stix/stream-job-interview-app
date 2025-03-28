"use client";
import { useRouter } from "next/navigation";
import { fields } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { jobSeekerSignUp } from "@/lib/auth-functions";
import { toast } from "sonner";

export default function Register() {
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setButtonClicked(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		const result = await jobSeekerSignUp(formData);
		if (result.user) {
			toast.success("Authentication Successful", {
				description: result.message,
			});
			setButtonClicked(false);
			router.push("/applicant/login");
		} else {
			toast.error("Authentication Failed", {
				description: result.message,
			});
			setButtonClicked(false);
		}
	};

	return (
		<section  className='md:w-3/4 w-full h-full flex flex-col justify-center md:px-8 px-6 py-8 '>
			<h2 className='text-3xl font-bold mb-3 md:text-left text-center'>
				Job Seeker Registration
			</h2>
			<form className='w-full' onSubmit={handleSubmit}>
				<label htmlFor='name' className='mb-2 opacity-60'>
					Full Name
				</label>
				<input
					required
					type='text'
					id='name'
					name='name'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>
				<label htmlFor='email' className='mb-2 opacity-60'>
					Email Address
				</label>
				<input
					required
					type='email'
					id='email'
					name='email'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='bio' className='mb-2 opacity-60'>
					Bio
				</label>
				<input
					required
					type='text'
					id='bio'
					name='bio'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
					placeholder="Ex. Engineer @ Google"
				/>

				<label htmlFor='field' className='mb-2 opacity-60'>
					Field of Interest
				</label>
				<select
					required
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
					id='field'
					name='field'
				>
					{fields.map((field) => (
						<option key={field.value} value={field.value}>
							{field.name}
						</option>
					))}
				</select>

				<label htmlFor='password' className='mb-2 opacity-60'>
					Password
				</label>
				<input
					required
					type='password'
					minLength={8}
					id='password'
					name='password'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2'
				/>

				<label htmlFor='image' className='mb-2 opacity-60  '>
					Headshot (JPG or PNG)
				</label>
				<input
					required
					type='file'
					name='image'
					accept='image/png, image/jpeg'
					id='image'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2  '
				/>

				<label htmlFor='url' className='mb-2 opacity-60  '>
					Portfolio URL
				</label>
				<input
					required
					type='url'
					id='url'
					name='url'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='cv' className='mb-2 opacity-60  '>
					Upload CV / Resume (PDF)
				</label>
				<input
					required
					type='file'
					name='cv'
					accept='application/pdf'
					id='cv'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2  '
				/>

				<button
					type='submit'
					disabled={buttonClicked}
					className='mt-6 mb-2 text-lg text-white rounded-md bg-blue-500 w-full px-8 py-4 cursor-pointer hover:bg-blue-600'
				>
					{buttonClicked ? "Registering..." : "Register"}
				</button>
				<p className=' opacity-60 text-center'>
					Already have an account?{" "}
					<Link href='/applicant/login' className='text-blue-800'>
						Sign in
					</Link>
				</p>
			</form>
		</section>
	);
}
"use client"
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { createJobPosting } from "@/lib/db-functions";
import { toast } from "sonner";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	user: RecruiterFirebase;
}

export default function CreateJob({ isOpen, onClose, user }: Props) {
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);
	
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
		e.preventDefault();
		setButtonClicked(true);
		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const result = await createJobPosting(formData, user);
		if (result.code === "job/success") {
			toast.success(result.message);
			setButtonClicked(false);
			onClose();
		} else {
			toast.error(result.message);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-4xl rounded-md'>
				<DialogHeader>
					<DialogTitle className='text-2xl text-blue-500'>
						Add Job Opening
					</DialogTitle>
					<DialogDescription>
						Create jobs to be posted on the job board
					</DialogDescription>

					<form className='pt-4 text-left' onSubmit={handleSubmit}>
						<label
							htmlFor='jobTitle'
							className='block font-medium text-gray-700'
						>
							Job Title
						</label>
						<input
							type='text'
							name='jobTitle'
							id='jobTitle'
							className='px-4 py-3 border-[1px] border-blue-500 rounded-sm w-full mb-3'
							required
						/>

						<label
							htmlFor='jobDescription'
							className='block font-medium text-gray-700'
						>
							Job Description
						</label>

						<textarea
							name='jobDescription'
							id='jobDescription'
							className='px-4 py-3 border-[1px] border-blue-500 text-sm rounded-sm w-full mb-3'
							required
							rows={10}
						/>

						<label
							htmlFor='expiryDate'
							className='block font-medium text-gray-700'
						>
							Expiry Date
						</label>
						<input
							type='date'
							name='expiryDate'
							id='expiryDate'
							className='px-4 py-3 border-[1px] border-blue-500 rounded-sm w-full mb-3'
							required
						/>

						<button
							type='submit'
							className='bg-blue-500 text-white px-4 py-3 rounded-sm w-full mt-4'
							disabled={buttonClicked}
						>
							{buttonClicked ? "Creating Job..." : "Create Job"}
						</button>
					</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
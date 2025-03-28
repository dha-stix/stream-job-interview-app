"use client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getJobApplicants, handleRejectApplication, updateJobStatus } from "@/lib/db-functions";
import { useGetStreamClient } from "@/app/(stream)/hooks/useGetStreamClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { createChannel } from "../../../../../../../actions/stream.action";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import RecruiterAuthContext from "@/app/auth-contexts/Recruiter";
import { useParams, useRouter } from "next/navigation";
import Nav from "@/app/auth-contexts/Nav";
import { toast } from "sonner";
import Link from "next/link";

interface ModalProps {
	setOpenCallModal: React.Dispatch<React.SetStateAction<boolean>>;
	applicantId: string;
	recruiterId: string;
}

export default function JobApplicants() {
	const { user, loading } = useContext(RecruiterAuthContext);
	const [applicants, setApplicants] = useState<ApplicationProps[]>([]);
	const { id } = useParams<{ id: string }>();

	const getApplicants = useCallback(async () => {
		const result = await getJobApplicants(id);
		setApplicants(result.applicants);
	}, [id]);

	useEffect(() => {
		getApplicants();
	}, [getApplicants]);

	if (loading || !user || !applicants) {
		return <p>Loading...</p>;
	}

	return (
		<main>
			<Nav user={user} recruiter={true} />
			<div className='px-8 w-full min-h-[90vh] py-4'>
				<h3 className='text-xl font-semibold mb-5'>
					Job Applicants ({applicants.length})
				</h3>

				<Accordion type='single' collapsible className='w-full'>
					{applicants.length > 0 ? (
						applicants.map((applicant) => (
							<ApplicantItem
								applicant={applicant}
								key={applicant.id}
								recruiterId={user.id}
								user={user}
							/>
						))
					) : (
						<p className='text-sm text-gray-500'>No applicants yet</p>
					)}
				</Accordion>
			</div>
		</main>
	);
}

//👇🏻 Rendering each application

const ApplicantItem = ({
	applicant,
	recruiterId,
	user
}: {
	applicant: ApplicationProps;
		recruiterId: string;
	user: RecruiterFirebase | JobSeekerFirebase
	}) => {
	const { client: chatClient } = useGetStreamClient(user);
	const [openCallModal, setOpenCallModal] = useState<boolean>(false);
	const router = useRouter();

	const filter = { members: { $in: [user.id, applicant.user.id] } }; 
	// const sort = { last_message_at: -1 };

	const handleMessage = async () => {
		const result = await createChannel({
			recruiterId,
			applicant,
		});
		const { status } = await updateJobStatus(applicant.id, "Interviewing");

		if (result.success && status === 200) {
			toast.success("Applicant Accepted", {
				description: "You can now chat with the applicant",
			});

			router.push(`/chat/${result.id}`);
		} else {
			toast.error("Error occured");
		}
	};

	const handleDelete = async () => {
		try {
			if (!chatClient) {
				toast.error("Error occured");
				return;
			}
			const channels = await chatClient?.queryChannels(filter, undefined, {
				watch: true, // Keep real-time updates
				state: true, // Fetch channel state (messages, members, etc.)
			});
			const result = await handleRejectApplication(applicant);
			if (result.status === 200) {
				if (channels && channels.length > 0) {
					await channels[0].delete();
				}
				toast.success(result.message, {
					description: "Applicant has been rejected",
				});
       
			} else {
				toast.error("Error occured while rejecting the applicant");
			}
			window.location.reload();
		} catch (error) { 
			toast.error("Error occured");
			console.log(error)
		}
	};

	return (
		<AccordionItem
			value={applicant.id}
			className=' rounded-md px-5 border-2 border-gray-300 mb-2'
			key={applicant.id}
		>
			<AccordionTrigger className=' flex items-center space-x-2'>
				<Avatar>
					<AvatarImage src={applicant.user.image} alt={applicant.user.name} />
					<AvatarFallback>{applicant.user.name}</AvatarFallback>
				</Avatar>
				{applicant.user.name} - {applicant.user.bio}
			</AccordionTrigger>
			<AccordionContent>
				<Link
					href={`/applicant/${applicant.user.id}`}
					className='underline text-blue-500'
					target='_blank'
				>
					View {applicant.user.name} page
				</Link>

				<div className='mt-4'>
					<h3 className='font-semibold text-lg'>Cover Letter</h3>
					<p className='opacity-60'>{applicant.coverLetter}</p>
				</div>

				<div className='mt-4'>
					<h3 className='font-semibold text-lg'>Note to Recruiter</h3>
					<p className='opacity-60'>{applicant.note}</p>
				</div>
				<div className='mt-4 flex items-center justify-between w-full'>
					<Link
						href={applicant.user.cv}
						className='block text-white rounded-sm p-3 bg-blue-600'
						target='_blank'
					>
						View Resume
					</Link>

					<div className='flex items-center space-x-4'>
						<Dialog open={openCallModal} onOpenChange={setOpenCallModal}>
							<DialogTrigger asChild>
								<button className='bg-blue-600 text-white rounded-sm px-4 py-2'>
									Schedule Interview
								</button>
							</DialogTrigger>
							<DialogContent className='sm:max-w-4xl'>
								<ScheduleInterviewModal setOpenCallModal={setOpenCallModal} applicantId={applicant.user.id} recruiterId={recruiterId} />
							</DialogContent>
						</Dialog>

						<button
							className='bg-green-600 text-white rounded-sm px-4 py-2'
							onClick={() => handleMessage()}
						>
							Message
						</button>
						<button
							className='bg-red-600 text-white rounded-sm px-4 py-2'
							onClick={() => handleDelete()}
						>
							Delete
						</button>
					</div>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};

//👇🏻 Modal for scheduling interviews
const ScheduleInterviewModal = ({ setOpenCallModal, applicantId, recruiterId }: ModalProps) => {
	const [description, setDescription] = useState<string>("");
	const [dateTime, setDateTime] = useState<string>("");

	const getCurrentDateTime = () => {
		const now = new Date();
		return now.toISOString().slice(0, 16);
	};

	const [minDateTime, setMinDateTime] = useState(getCurrentDateTime());
	const client = useStreamVideoClient();

	useEffect(() => {
		setMinDateTime(getCurrentDateTime());
	}, []);

	const handleScheduleMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!description || !dateTime || !client) return;

		 try {
			const id = crypto.randomUUID();
			const call = client.call("default", id);
			if (!call) throw new Error("Failed to create meeting");

			await call.getOrCreate({
				data: {
					starts_at: new Date(dateTime).toISOString(),
					custom: {
						description,
					},
					members: [{ user_id: applicantId }, { user_id: recruiterId }],
				},
			});
			 const { status } = await updateJobStatus(applicantId, "Interviewing");
			 if (status !== 200) {
				 throw new Error("Failed to update the status");
			 }
			 toast("Call Scheduled", {
				description: `The call has been scheduled for ${dateTime}`,
			});
            setOpenCallModal(false);
		 } catch (error) {
			 console.error(error)
			 toast.error("Error occured", {
				description: "Failed to schedule the call",
			 });
			 
		}
	};

	return (
		<section className='p-4 w-full'>
			<DialogHeader>
				<DialogTitle className='text-2xl font-bold text-blue-500'>
					Schedule a call
				</DialogTitle>
				<DialogDescription className='text-sm text-gray-500 mb-5'>
					Enter the name and description for the call
				</DialogDescription>

				<form className='w-full' onSubmit={handleScheduleMeeting}>
					<label
						className='block text-left text-sm font-medium text-gray-700'
						htmlFor='description'
					>
						Meeting Description
					</label>
					<input
						type='text'
						name='description'
						id='description'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='mt-1 block w-full text-sm py-3 px-4 border-gray-200 border-[1px] rounded mb-3'
						required
						placeholder='Enter a description for the meeting'
					/>

					<label
						className='block text-left text-sm font-medium text-gray-700'
						htmlFor='date'
					>
						Date and Time
					</label>

					<input
						type='datetime-local'
						id='date'
						name='date'
						required
						className='mt-1 block w-full text-sm py-3 px-4 border-gray-200 border-[1px] rounded mb-3'
						value={dateTime}
						onChange={(e) => setDateTime(e.target.value)}
						min={minDateTime}
					/>

					<button className='w-full bg-blue-600 text-white py-3 rounded mt-4 cursor-pointer'>
						Schedule Call
					</button>
				</form>
			</DialogHeader>
		</section>
	);
};
"use client";
import { formatDateTime } from "@/lib/utils";
import { Call } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
interface CallCardProps {
	call: Call;
	type: "ongoing" | "upcoming";
}

export default function InterviewContainer({
	upcomingCalls,
	ongoingCalls,
}: {
	upcomingCalls: Call[];
	ongoingCalls: Call[];
}) {
	return (
		<div>
			<h1 className='text-lg font-bold mb-4'>Upcoming Interviews</h1>
			<div className='flex flex-col space-y-2 px-2'>
				{ongoingCalls.map((call) => (
					<InterviewCard key={call.id} call={call} type='ongoing' />
				))}

				{upcomingCalls.map((call) => (
					<InterviewCard key={call.id} call={call} type='upcoming' />
				))}
				{!upcomingCalls.length && !ongoingCalls.length && (
					<p className='text-center text-gray-400'>No interviews scheduled</p>
				)}
			</div>
		</div>
	);
}

const InterviewCard = ({ call, type }: CallCardProps) => {
	const router = useRouter();
	const handleBtnClick = (call: Call) => {
		if (type === "upcoming") return null;
		router.push(`/interview/${call.id}`);
	};

	return (
		<div className='w-full bg-white rounded-md shadow-sm  px-8 py-5 flex items-center justify-between'>
			<div>
				<h2 className='text-sm text-blue-500'>
					{call.state?.custom?.description}
				</h2>
				<p className='text-xs'>
					{formatDateTime(call.state?.startsAt?.toLocaleString())}
				</p>
			</div>

			<section>
				<button
					className={`${
						type === "ongoing" ? "bg-red-500" : "bg-blue-400"
					} text-white rounded-sm px-4 py-2 cursor-pointer`}
					onClick={() => handleBtnClick(call)}
				>
					{type === "ongoing" ? "Join Now" : "Not Yet"}
				</button>
			</section>
		</div>
	);
};
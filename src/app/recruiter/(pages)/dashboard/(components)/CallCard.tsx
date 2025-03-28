"use client";

import { formatDateTime } from "@/lib/utils";
import { Call } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

interface CallCardProps {
	call: Call;
	type: "ongoing" | "upcoming";
}

export default function CallCard({ call, type }: CallCardProps) {
    const router = useRouter();
	const handleBtnClick = (call: Call) => {
		if (type === "upcoming") return null;
		router.push(`/interview/${call.id}`);
	};
	return (
		<div className='rounded-sm border border-gray-400 py-4 px-6 flex items-center justify-between mb-4'>
			<p className='opacity-70'>
				{call.state?.custom?.description }
			</p>
			<div className='flex items-center space-x-6'>
				<p className='opacity-50 text-sm'>
					{formatDateTime(call.state?.startsAt?.toLocaleString())}
				</p>
				<button
					className={`${
						type === "ongoing" ? "bg-red-500" : "bg-blue-500"
					} text-white rounded-sm px-4 py-2 cursor-pointer`}
					onClick={() => handleBtnClick(call)}
				>
					{type === "ongoing" ? "Join Now" : "Not Yet"}
				</button>
			</div>
		</div>
	);
}
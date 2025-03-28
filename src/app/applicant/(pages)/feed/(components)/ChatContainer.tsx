"use client";
import Link from "next/link";
import type { Channel } from "stream-chat";

export default function ChatContainer({ channels }: { channels: Channel[] }) {
	return (
		<div className='mt-6'>
			<h1 className='text-lg font-bold mb-4'>Open Chats</h1>
			<div className='flex flex-col space-y-2 px-2'>
				{channels?.map((channel) => (
					<ChatCard key={channel.id} channel={channel} />
				))}
				{channels?.length === 0 && (
					<p className='text-sm text-gray-500'>No open chats</p>
				)}
			</div>
		</div>
	);
}

const ChatCard = ({ channel }: { channel: Channel }) => {
	return (
		<div className='w-full bg-white rounded-md shadow-sm px-8 py-5 flex items-center justify-between'>
			<div>
				<h2 className='text-sm text-blue-500'>{channel.data?.name}</h2>
				<p className='text-xs'>
					{(channel.data?.created_by as { name: string })?.name}
				</p>
			</div>

			<section>
				<Link href={`/chat/${channel.id}`} target="_blank" className='bg-red-400 hover:bg-red-600 text-white p-3 rounded-md text-sm'>
					Reply
				</Link>
			</section>
		</div>
	);
};
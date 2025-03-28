"use client";
import {
	Chat,
	Channel,
	ChannelList,
	Window,
	ChannelHeader,
	MessageList,
	MessageInput,
} from "stream-chat-react";
import { useGetStreamClient } from "../../hooks/useGetStreamClient";

export default function StreamChatUI({ user }: { user: JobSeekerFirebase | RecruiterFirebase }) {

    const {client} = useGetStreamClient(user!);

	const filters = { members: { $in: [user.id] }, type: "messaging" };
	const options = { presence: true, state: true };

	if (!client) return <div>Loading...</div>;

	return (
		<Chat client={client}>
			<div className='chat-container'>
				{/* Channel List */}
				<div className='channel-list'>
					<ChannelList
						sort={{ last_message_at: -1 }}
						filters={filters}
						options={options}
					/>
				</div>

				{/* Messages Panel */}
				<div className='chat-panel'>
					<Channel>
						<Window>
							<ChannelHeader />
							<MessageList />
							<MessageInput />
						</Window>
					</Channel>
				</div>
			</div>
		</Chat>
	);
}
"use client";
import { useGetStreamClient } from "@/app/(stream)/hooks/useGetStreamClient";
import { useStreamVideoClient, Call } from "@stream-io/video-react-sdk";
import { useContext, useEffect, useCallback, useState } from "react";
import InterviewContainer from "./(components)/InterviewContainer";
import ChatContainer from "./(components)/ChatContainer";
import JobsContainer from "./(components)/JobsContainer";
import AuthContext from "@/app/auth-contexts/Applicant";
import { getJobFeed } from "@/lib/db-functions";
import Nav from "../../../auth-contexts/Nav";
import type { Channel } from "stream-chat";

export default function JobFeed() {
	const { user, loading } = useContext(AuthContext);
	const [jobs, setJobs] = useState<JobProps[]>([]);
	const client = useStreamVideoClient();
	const { client: chatClient } = useGetStreamClient(user!);
	const [upcomingCalls, setCalls] = useState<Call[]>([]);
	const [channels, setChannels] = useState<Channel[]>([]);
	const [ongoingCalls, setOngoingCalls] = useState<Call[]>([]);

	const fetchCallsAndChats = useCallback(async () => {
		if (!client || !user) return;
		//👇🏻 Fetch calls where the user is a member
		const { calls } = await client.queryCalls({
			sort: [{ field: "starts_at", direction: 1 }],
			filter_conditions: { members: { $in: [user.id] } }, // Find calls where the user is a member
			limit: 10,
		});

		const now = new Date();
		const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
			return startsAt && new Date(startsAt) > now;
		});
		const ongoingCalls = calls?.filter(
			({ state: { startsAt, endedAt } }: Call) => {
				return startsAt && new Date(startsAt) < now && !endedAt;
			}
		);

		const filter = { members: { $in: [user.id] } }; // Fetch channels where the user is a member
		// const sort = [{ last_message_at: -1 }];

		//👇🏻 Fetch channels where the user is a member
        const channels = await chatClient?.queryChannels(filter, undefined, {
          watch: true, // Keep real-time updates
          state: true, // Fetch channel state (messages, members, etc.)
		});

		setOngoingCalls(ongoingCalls);
		setCalls(upcomingCalls);
		setChannels(channels as Channel[])

	}, [client, user, chatClient]);

	const fetchJobs = useCallback(async () => {
		if (!user) return;
		const result = await getJobFeed(user);

		//get upcoming calls and opened chats
		setJobs(result);
	}, [user]);

	useEffect(() => {
		fetchJobs();
	}, [fetchJobs]);

	useEffect(() => {
		fetchCallsAndChats();
	}, [fetchCallsAndChats]);

	if (loading || !user || !chatClient) {
		return <p>Loading...</p>;
	}

	return (
		<main className=' min-h-[90vh] w-full'>
			<Nav user={user} />

			<div className='w-full lg:p-8 p-4 flex lg:flex-row flex-col items-start justify-between gap-5 h-[50vh]'>
				<div className='lg:w-3/5 border-gray-400 border-[1px] rounded-sm shadow-sm w-full flex flex-col space-y-4 p-4 h-[85vh] overflow-y-auto scrollbar-custom'>
					<JobsContainer jobs={jobs} />
				</div>

				<div className='lg:w-2/5 bg-gray-100 w-full rounded-sm shadow-sm h-[85vh] overflow-y-auto scrollbar-custom p-4'>
					<InterviewContainer ongoingCalls={ongoingCalls} upcomingCalls={upcomingCalls} />

					<ChatContainer channels={channels} />
				</div>
			</div>
		</main>
	);
}
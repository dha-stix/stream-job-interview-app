"use server";
import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY!;

// 👇🏻 -- For Stream Chat  --
const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

export async function createToken(
	user: RecruiterFirebase | JobSeekerFirebase
): Promise<string> {
	if (!user) throw new Error("User is not authenticated");
	return serverClient.createToken(user.id);
}

export const createStreamUser = async (
	id: string,
	name: string,
	image: string
) => {
	const { users } = await serverClient.queryUsers({ id });
	if (users.length > 0) return users[0];

	const user = await serverClient.upsertUser({
		id,
		name,
		image,
	});

	return user;
};

export async function createChannel({
	recruiterId,
	applicant,
}: {
	recruiterId: string;
	applicant: ApplicationProps;
}) {
	try {
		//check if channel already exists
		const filter = {
			type: "messaging",
			members: { $in: [recruiterId, applicant.user.id] },
		};
		// const sort = [{ last_message_at: -1 }];

		const channels = await serverClient.queryChannels(filter, undefined, {
			watch: true,
			state: true,
		});
		if (channels.length > 0) {
			return { success: true, error: null, id: channels[0].id };
		}

		const channel = serverClient.channel(
			"messaging",
			`${applicant.jobID}-chat-${applicant.user.id}`,
			{
				name: `Meeting with ${applicant.user.name}`,
				members: [recruiterId, applicant.user.id],
				created_by_id: recruiterId,
			}
		);
		await channel.create();
		return { success: true, error: null, id: channel.id };
	} catch (err) {
		console.log("Error creating channel:", err);
		return { success: false, error: "Failed to create channel", id: null };
	}
}

// 👇🏻 -- For Stream Video SDK  --
export const tokenProvider = async (user_id: string) => {
	if (!STREAM_API_KEY) throw new Error("Stream API key secret is missing");
	if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

	const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

	const expirationTime = Math.floor(Date.now() / 1000) + 3600;
	const issuedAt = Math.floor(Date.now() / 1000) - 60;

	const token = streamClient.generateUserToken({
		user_id,
		exp: expirationTime,
		validity_in_seconds: issuedAt,
	});

	return token;
};
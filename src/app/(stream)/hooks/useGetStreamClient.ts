import { useCreateChatClient } from "stream-chat-react";
import { createToken } from "../../../../actions/stream.action";
import { useCallback } from "react";

export const useGetStreamClient = (
	user: JobSeekerFirebase | RecruiterFirebase
) => {
	const tokenProvider = useCallback(async () => {
		return await createToken(user);
	}, [user]);

	const client = useCreateChatClient({
		apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
		tokenOrProvider: tokenProvider,
		userData: { id: user.id, name: user.name, image: user.image },
	});

	if (!client) return { client: null };

	return { client };
};
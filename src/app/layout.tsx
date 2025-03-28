import { Toaster } from "@/components/ui/sonner";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
const inter = Rubik({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
});
import "./globals.css";

export const metadata: Metadata = {
	title: "Jobber",
	description:
		"A job application and interview platform for recruiters and job seekers.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<main>{children}</main>
				<Toaster />
			</body>
		</html>
	);
}
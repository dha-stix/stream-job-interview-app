## Job Application and Interview Application 
A Job and interview platform that lets recruiters post jobs and job applicants apply using their profiles. 
Recruiters can also create virtual interview sessions and send direct messages to applicants on the app using Stream.

## Useful Links
[Article explaining the project](https://getstream.io/blog/job-app-interview-platform/)

## Getting Started
- Clone the GitHub repository.
- Run `npm install` to install the project dependencies.
- Sign in and create a [Stream app](https://getstream.io/).
- Copy the app secret and API key into the `.env.local` file:
  ```env
  NEXT_PUBLIC_STREAM_API_KEY=<your_Stream_API_key>
  STREAM_SECRET_KEY=<your_Stream_Secret_key>
  ```
- Set up Firebase within the app and copy your Firebase config into the [`lib/firebase.ts`](https://github.com/dha-stix/stream-job-interview-app/blob/main/src/lib/firebase.example.ts) file.
- Set up Firebase Storage, Email and Password Authentication, and Firestore.
- Start the development server by running `npm run dev`.

## Tools
- [Firebase](https://firebase.google.com/)
- [Shadcn UI](https://ui.shadcn.com/docs/installation)
- [Stream Video and Audio SDK](https://getstream.io/video/docs/react/)
- [Stream Chat SDK](https://getstream.io/chat/docs/react/)
- Next.js and Tailwind CSS

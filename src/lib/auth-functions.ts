import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import db, { auth, storage } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { createStreamUser } from "../../actions/stream.action";

export const jobSeekerSignUp = async (form: FormData) => {
	const userData: JobSeeker = {
		name: form.get("name") as string,
		email: form.get("email") as string,
		bio: form.get("bio") as string,
		password: form.get("password") as string,
		fieldOfInterest: form.get("field") as JobSeeker["fieldOfInterest"],
		image: form.get("image") as File,
		cv: form.get("cv") as File,
		portfolioUrl: form.get("url") as string,
	};

	const { user } = await createUserWithEmailAndPassword(
		auth,
		userData.email,
		userData.password
	);

	if (!user) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to create user",
		};
	}

	const cvRef = ref(storage, `resumes/${user.uid}/cv`);
	const imageRef = ref(storage, `applicants/${user.uid}/image`);

	await uploadBytes(cvRef, userData.cv).then(async () => {
		await uploadBytes(imageRef, userData.image).then(async () => {
            const [cvDownloadURL, imageDownloadURL] = await Promise.all([
                getDownloadURL(cvRef),
                getDownloadURL(imageRef),
            ])
			if (!cvDownloadURL || !imageDownloadURL) {
				return {
					code: "auth/failed",
					status: 500,
					user: null,
					message: "Failed to upload cv or image",
				};
			}
			const docRef = doc(db, "jobSeekers", user.uid);

			await setDoc(docRef, {
				name: userData.name,
				email: userData.email,
				bio: userData.bio,
				fieldOfInterest: userData.fieldOfInterest,
				portfolioUrl: userData.portfolioUrl,
				cv: cvDownloadURL,
				image: imageDownloadURL,
			});
		});
	});

	return {
		code: "auth/success",
		status: 200,
		user,
		message: "Acount created successfully! 🎉",
	};
};

export const recruiterSignUp = async (form: FormData) => {
	const userData: Recruiter = {
		name: form.get("name") as string,
		email: form.get("email") as string,
		companyName: form.get("companyName") as string,
		companyPosition: form.get("companyPosition") as string,
		password: form.get("password") as string,
		field: form.get("field") as Recruiter["field"],
		image: form.get("image") as File,
		url: form.get("url") as string,
	};

	const { user } = await createUserWithEmailAndPassword(
		auth,
		userData.email,
		userData.password
	);

	if (!user) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to create user",
		};
	}

	const imageRef = ref(storage, `recruiters/${user.uid}/image`);
	await uploadBytes(imageRef, userData.image).then(async () => {
		const downloadURL = await getDownloadURL(imageRef);
		if (!downloadURL) {
			return {
				code: "auth/failed",
				status: 500,
				user: null,
				message: "Failed to upload image",
			};
		}
		const docRef = doc(db, "recruiters", user.uid);

		await setDoc(docRef, {
			name: userData.name,
			email: userData.email,
			companyName: userData.companyName,
			companyPosition: userData.companyPosition,
			field: userData.field,
			url: userData.url,
			image: downloadURL,
		});
	});

	return {
		code: "auth/success",
		status: 200,
		user,
		message: "Acount created successfully! 🎉",
	};
};

export const jobSeekerAuthLogin = async (form: FormData) => {
	const email = form.get("email") as string;
	const password = form.get("password") as string;

	const { user } = await signInWithEmailAndPassword(auth, email, password);

	if (!user) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to login",
		};
	}

	const userRef = doc(db, "jobSeekers", user.uid);
	const docSnap = await getDoc(userRef);

	if (!docSnap.exists()) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "User Not a Job Seeker",
		};
	}

	const streamUser = await createStreamUser(
		user.uid,
		docSnap.data().name,
		docSnap.data().image
	);

	return {
		code: "auth/success",
		status: 200,
		user,
		message: "Login successful",
		stream: streamUser,
	};
};

export const recruiterAuthLogin = async (form: FormData) => {
	const email = form.get("email") as string;
	const password = form.get("password") as string;

	const { user } = await signInWithEmailAndPassword(auth, email, password);

	if (!user) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to login",
		};
	}

	const userRef = doc(db, "recruiters", user.uid);
	const docSnap = await getDoc(userRef);

	if (!docSnap.exists()) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "User Not a Recruiter",
		};
	}

	const streamUser = await createStreamUser(
		user.uid,
		docSnap.data().name,
		docSnap.data().image
	);

	return {
		code: "auth/success",
		status: 200,
		user,
		message: "Login successful",
		stream: streamUser,
	};
};

export const authLogout = async () => {
	try {
		await auth.signOut();
		return { code: "auth/success", status: 200, message: "Logout successful" };
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			message: "Failed to logout",
			err,
		};
	}
};

export const getUserProfile = async (uid: string) => {
	const userRef = doc(db, "jobSeekers", uid);
	const docSnap = await getDoc(userRef);

	if (!docSnap.exists()) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Invalid ID",
		};
	}

	return {
		code: "auth/success",
		status: 200,
		user: docSnap.data() as JobSeekerFirebase,
		message: "User found",
	};
};
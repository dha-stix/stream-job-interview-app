interface AuthContextType {
    user: JobSeekerFirebase | RecruiterFirebase |  null;
    loading: boolean;
}

interface Recruiter {
    name: string;
    email: string;
    companyName: string;
    companyPosition: string;
    url: string;
    field: "tech" | "consulting" | "finance" | "healthcare";
    password: string;
    image: File 
}
interface RecruiterFirebase {
    name: string;
    email: string;
    companyName: string;
    companyPosition: string;
    url: string;
    id: string;
    field: "tech" | "consulting" | "finance" | "healthcare";
    image: string;
}

interface JobSeeker { 
    name: string;
    email: string;
    password: string;
    image: File;
    bio: string;
    cv: File;
    fieldOfInterest: "tech" | "consulting" | "finance" | "healthcare";
    portfolioUrl: string;
}
interface JobSeekerFirebase { 
    name: string;
    email: string;
    image: string;
    bio: string;
    cv: string;
    id: string;
    fieldOfInterest: "tech" | "consulting" | "finance" | "healthcare";
    portfolioUrl: string;
}

interface JobProps {
    applications: Applicants[];
    companyName: string;
    companyPosition: string;
    doc_id: string;
    expiryDate: string;
    email: string;
    image: string;
    jobDescription: string;
    jobTitle: string;
    id: string;
    field: string;
    name: string;
    url: string;
    status?: "Pending" | "Interviewing";
}
interface Applicants {
    userId: string;
    applicationId: string;
}
interface ApplicationProps {
    id: string;
    coverLetter: string;
    jobID: string;
    note: string;
    user: JobSeekerFirebase;
    status: "Pending" | "Interviewing";
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fields: { value: string; name: string }[] = [
  {
    value: "",
    name: "Select field",
  },
  {
    value: "tech",
    name: "Technology",
  },
  {
    value: "consulting",
    name: "Consulting",
  },
  {
    value: "finance",
    name: "Finance",
  },
  {
    value: "healthcare",
    name: "Healthcare",
  },
];

export const formatDateTime = (dateTimeString: string | undefined): string => {
	if (!dateTimeString) {
		return "";
	}
	// Step 1: Parse the input string to a Date object
	const [datePart, timePart] = dateTimeString.split(", ");
	const [day, month, year] = datePart.split("/").map(Number);
	const [hours, minutes] = timePart.split(":").map(Number);

	const date = new Date(year, month - 1, day, hours, minutes); // month is 0-indexed

	// Step 2: Extract the time in 12-hour format with AM/PM
	const hours12 = date.getHours() % 12 || 12; // Converts 24-hour format to 12-hour
	const ampm = date.getHours() >= 12 ? "pm" : "am";

	// Step 3: Return the formatted string with 12-hour time
	return `${datePart}, ${hours12}:${minutes
		.toString()
		.padStart(2, "0")}${ampm}`;
};
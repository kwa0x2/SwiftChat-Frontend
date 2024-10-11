import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {v4 as uuidv4} from 'uuid';

//#region Class Name Management
// Combines and merges class names using clsx and Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//#endregion

//#region Time Extraction
// Extracts time (HH:mm) from a given timestamp (ISO format)
export const extractTime = (timestamp: string) => {
  const time = timestamp.split("T")[1].split(".")[0];
  return time.slice(0, 5);
};
//#endregion

//#region File Name and URL Extraction
// Extracts file name and URL from a message containing a file path
export const getFileNameAndUrl = (message: string) => {
  const urlParts = message.split("/");
  const fileName = urlParts.pop();
  const fileContent = fileName?.split("_").slice(1).join("_");

  if (!fileName) {
    return { fileName: null, finalUrl: null }; // Return null if no file name found
  }

  const baseUrl = urlParts.join("/");
  const encodedFileName = encodeURIComponent(fileName);
  const finalUrl = `${baseUrl}/${encodedFileName}`;

  return { fileName, finalUrl };
};
//#endregion
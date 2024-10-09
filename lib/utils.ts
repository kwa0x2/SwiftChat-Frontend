import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {v4 as uuidv4} from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractTime = (timestamp: string) => {
  const time = timestamp.split("T")[1].split(".")[0];
  return time.slice(0, 5);
};

export const generateUUID = () => {
  return uuidv4();
};

export const getFileNameAndUrl = (message: string) => {
  const urlParts = message.split("/");
  const fileName = urlParts.pop();
  const fileContent = fileName?.split("_").slice(1).join("_");

  if (!fileName) {
    return { fileName: null, finalUrl: null }; // Dosya adı bulunamazsa null döner
  }

  const baseUrl = urlParts.join("/");
  const encodedFileName = encodeURIComponent(fileName);
  const finalUrl = `${baseUrl}/${encodedFileName}`;

  return { fileName, finalUrl };
};
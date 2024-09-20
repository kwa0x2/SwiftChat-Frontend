import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {v4 as uuidv4} from 'uuid';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

<<<<<<< HEAD

export const extractTime = (timestamp: string) => {
  const time = timestamp.split("T")[1].split(".")[0];
  return time.slice(0, 5);
=======
export const generateUUID = () => {
    return uuidv4();
>>>>>>> 8d5a91547291fce1cccc0a96755edca11146c760
};

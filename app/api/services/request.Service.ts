import axios from "../axios";
import {RequestStatus} from "@/models/Enum";

export const ComingRequests = async () => {
    return await axios.get("/request");
};


export const SendFriendRequest = async (email: string) => {
    const body = {
        email: email,
    };
    return await axios.post("/request", body);
};

export const UpdateFriendshipRequest = async (senderMail: string, status: RequestStatus) => {
    const body = {
        email: senderMail,
        status: status,
    }
    return await axios.patch("/request", body)
}
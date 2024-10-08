import axios from "../axios";



export const checkAndGetPrivateRoom = async (friendMail: string) => {
    const body = {
        email: friendMail,
    }
    return await axios.post("/room/check", body);
}

export const getChatListHistory = async () => {
    return await axios.get("/room/chatlist");
}
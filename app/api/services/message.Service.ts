import axios from "../axios";


export const getChatHistoryByRoomId = async (room_id: string) => {
    const body = {
        room_id: room_id
    }
    return await axios.post("/message/history", body);
}





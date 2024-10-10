export interface Message {
    message_id: string;
    message: string;
    sender_id:string;
    message_read_status: "unread" | "readed";
    message_type: "text"  | "file" | "photo";
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    message_starred:boolean
  }
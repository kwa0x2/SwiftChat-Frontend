import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatListItemModel {
  room_id: string;
  last_message: string;
  last_message_id: string;
  updatedAt?: string;
  user_name: string;
  user_photo: string;
  user_email: string;
  friend_status: string;
  createdAt: string;
  message_deleted_at?: string;
  activeStatus: boolean;
  message_type: "text" | "file" | "photo"
}

interface InitialState {
  chatLists: ChatListItemModel[];
}

const chatListSlice = createSlice({
  name: "chatList",
  initialState: {
    chatLists: [],
  } as InitialState,
  reducers: {
    setChatList: (state, action: PayloadAction<ChatListItemModel[]>) => {
      state.chatLists = action.payload;
    },
    addChatList: (state, action: PayloadAction<ChatListItemModel>) => {
      if (!state.chatLists) {
        state.chatLists = [];
      }
      state.chatLists.push(action.payload);
    },
    updateLastMessage: (
      state,
      action: PayloadAction<{
        room_id: string;
        message: string;
        message_id: string;
        updatedAt: string;
        message_type: "text" | "file" | "photo"
      }>
    ) => {
      const existingMessage = state.chatLists?.find(
        (msg) => msg.room_id === action.payload.room_id
      );
      if (existingMessage) {
        existingMessage.last_message = action.payload.message;
        existingMessage.updatedAt = action.payload.updatedAt;
        existingMessage.last_message_id = action.payload.message_id;
        existingMessage.message_type = action.payload.message_type;
        existingMessage.message_deleted_at = undefined
        state.chatLists = [
          existingMessage,
          ...state.chatLists.filter(
            (msg) => msg.room_id !== action.payload.room_id
          ),
        ];
      }
    },
    deleteLastMessage: (
      state,
      action: PayloadAction<{
        room_id: string;
        message_id: string;
        updatedAt: string;
        deletedAt: string;
      }>
    ) => {
      const existingMessage = state.chatLists?.find(
        (msg) => msg.room_id === action.payload.room_id
      );
      if (
        existingMessage &&
        existingMessage.last_message_id === action.payload.message_id
      ) {
        existingMessage.updatedAt = action.payload.updatedAt;
        existingMessage.message_deleted_at = action.payload.deletedAt;
        existingMessage.last_message = "";
        state.chatLists = [
          existingMessage,
          ...state.chatLists.filter(
            (msg) => msg.room_id !== action.payload.room_id
          ),
        ];
      }
    },
    updateRoomIdByEmail: (
      state,
      action: PayloadAction<{ room_id: string; user_email: string }>
    ) => {
      const existingMessage = state.chatLists?.find(
        (chatList) => chatList.user_email === action.payload.user_email
      );
      if (existingMessage) {
        existingMessage.room_id = action.payload.room_id;
        state.chatLists = [
          existingMessage,
          ...state.chatLists.filter(
            (chatList) => chatList.user_email !== action.payload.user_email
          ),
        ];
      }
    },
    updateChatListFriendStatusByEmail: (
      state,
      action: PayloadAction<{ friend_status: string; user_email: string }>
    ) => {
      const existingMessage = state.chatLists?.find(
        (chatList) => chatList.user_email === action.payload.user_email
      );
      if (existingMessage) {
        existingMessage.friend_status = action.payload.friend_status;
        state.chatLists = [
          existingMessage,
          ...state.chatLists.filter(
            (chatList) => chatList.user_email !== action.payload.user_email
          ),
        ];
      }
    },
    updateChatListUsernameByEmail: (
      state,
      action: PayloadAction<{ user_name: string; user_email: string }>
    ) => {
      const existingMessage = state.chatLists?.find(
        (chatList) => chatList.user_email === action.payload.user_email
      );
      if (existingMessage) {
        existingMessage.user_name = action.payload.user_name;
        state.chatLists = [
          existingMessage,
          ...state.chatLists.filter(
            (chatList) => chatList.user_email !== action.payload.user_email
          ),
        ];
      }
    },
    updateChatListUserPhotoByEmail: (
      state,
      action: PayloadAction<{ user_photo: string; user_email: string }>
    ) => {
      const existingMessage = state.chatLists?.find(
        (chatList) => chatList.user_email === action.payload.user_email
      );
      if (existingMessage) {
        existingMessage.user_photo = action.payload.user_photo;
        state.chatLists = [
          existingMessage,
          ...state.chatLists.filter(
            (chatList) => chatList.user_email !== action.payload.user_email
          ),
        ];
      }
    },
    updateChatListActiveStatusByEmails: (
      state,
      action: PayloadAction<{ activeEmails: string[] }>
    ) => {
      const activeEmails = action.payload.activeEmails;

      state.chatLists?.forEach((chatList) => {
        if (activeEmails.includes(chatList.user_email)) {
          chatList.activeStatus = true;
        } else {
          chatList.activeStatus = false;
        }
      });
    },
  },
});

export const {
  setChatList,
  updateLastMessage,
  updateChatListFriendStatusByEmail,
  updateChatListUsernameByEmail,
  updateChatListUserPhotoByEmail,
  updateRoomIdByEmail,
  deleteLastMessage,
  addChatList,
  updateChatListActiveStatusByEmails,
} = chatListSlice.actions;
export default chatListSlice.reducer;

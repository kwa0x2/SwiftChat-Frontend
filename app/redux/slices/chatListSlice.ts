import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatListItemModel {
  room_id: string;
  last_message_content: string;
  last_message_id: string;
  message_type: "text" | "file" | "photo" | "";
  user_name: string;
  user_photo: string;
  user_email: string;
  friend_status: string;
  createdAt: string;
  message_deleted_at?: string;
  updatedAt?: string;

  activeStatus: boolean;
  highlight: boolean
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
        message_content: string;
        message_id: string;
        updatedAt: string;
        message_type: "text" | "file" | "photo";
      }>
    ) => {
      const existingChatList = state.chatLists?.find(
        (msg) => msg.room_id === action.payload.room_id
      );
      if (existingChatList) {
        existingChatList.last_message_content = action.payload.message_content;
        existingChatList.updatedAt = action.payload.updatedAt;
        existingChatList.last_message_id = action.payload.message_id;
        existingChatList.message_type = action.payload.message_type;
        existingChatList.message_deleted_at = undefined;
        state.chatLists = [
          existingChatList,
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
      }>
    ) => {
      const existingChatList = state.chatLists?.find(
        (msg) => msg.room_id === action.payload.room_id
      );
      if (
        existingChatList &&
        existingChatList.last_message_id === action.payload.message_id
      ) {
        existingChatList.updatedAt = new Date().toISOString();
        existingChatList.message_deleted_at = new Date().toISOString();
        existingChatList.last_message_content = "";
        state.chatLists = [
          existingChatList,
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
      const existingChatList = state.chatLists?.find(
        (chatList) => chatList.user_email === action.payload.user_email
      );
      if (existingChatList) {
        existingChatList.room_id = action.payload.room_id;
        state.chatLists = [
          existingChatList,
          ...state.chatLists.filter(
            (chatList) => chatList.user_email !== action.payload.user_email
          ),
        ];
      }
    },
    updateChatListFriendStatusByEmail: (
      state,
      action: PayloadAction<{ user_email: string; friend_status: string }>
    ) => {
      const existingChatList = state.chatLists?.find(
        (chatList) => chatList.user_email === action.payload.user_email
      );
      if (existingChatList) {
        existingChatList.friend_status = action.payload.friend_status;
        state.chatLists = [
          existingChatList,
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
      const existingChatList = state.chatLists?.find(
        (chatList) => chatList.user_email === action.payload.user_email
      );
      if (existingChatList) {
        existingChatList.user_name = action.payload.user_name;
        state.chatLists = [
          existingChatList,
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
      const existingChatList = state.chatLists?.find(
        (chatList) => chatList.user_email === action.payload.user_email
      );
      if (existingChatList) {
        existingChatList.user_photo = action.payload.user_photo;
        state.chatLists = [
          existingChatList,
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
    updateChatListHighlightByRoomId: (
      state,
      action: PayloadAction<{ room_id: string, highlight: boolean }>
    ) => {
      const existingChatList = state.chatLists?.find(
        (chatList) => chatList.room_id === action.payload.room_id
      );
      console.warn("existingMessage",existingChatList)
      console.warn("action.payload.room_id",action.payload.room_id)

      if (existingChatList) {
        existingChatList.highlight = action.payload.highlight;
        state.chatLists = [
          existingChatList,
          ...state.chatLists.filter(
            (chatList) => chatList.room_id !== action.payload.room_id
          ),
        ];
      }
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
  updateChatListHighlightByRoomId
} = chatListSlice.actions;
export default chatListSlice.reducer;

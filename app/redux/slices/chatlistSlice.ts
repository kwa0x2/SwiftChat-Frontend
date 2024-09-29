import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MessageItemModel {
  room_id: string;
  last_message: string;
  updatedAt?: string;
  user_name: string;
  user_photo: string;
  user_email: string;
  friend_status: string;
  deletedAt?: string | null;
}

interface InitialState {
  messages: MessageItemModel[];
}

const chatListSlice = createSlice({
  name: "messageBox",
  initialState: {
    messages: [],
  } as InitialState,
  reducers: {
    setChatList: (state, action: PayloadAction<MessageItemModel[]>) => {
      state.messages = action.payload;
    },
    addChatList: (state, action: PayloadAction<MessageItemModel>) => {
      if (!state.messages) {
        state.messages = [];
      }
      state.messages.push(action.payload);
    },
    updateLastMessage: (
      state,
      action: PayloadAction<{
        room_id: string;
        message: string;
        updatedAt: string;
      }>
    ) => {
      console.warn("update", action.payload);
      const existingMessage = state.messages?.find(
        (msg) => msg.room_id === action.payload.room_id
      );
      if (existingMessage) {
        existingMessage.last_message = action.payload.message;
        existingMessage.updatedAt = action.payload.updatedAt;
        state.messages = [
          existingMessage,
          ...state.messages.filter(
            (msg) => msg.room_id !== action.payload.room_id
          ),
        ];
      }
    },
    updateRoomIdByEmail: (
      state,
      action: PayloadAction<{ room_id: string; user_email: string }>
    ) => {
      const existingMessage = state.messages?.find(
        (msg) => msg.user_email === action.payload.user_email
      );
      if (existingMessage) {
        existingMessage.room_id = action.payload.room_id;
        state.messages = [
          existingMessage,
          ...state.messages.filter(
            (msg) => msg.user_email !== action.payload.user_email
          ),
        ];
      }
    },
    updateChatListFriendStatusByEmail: (
      state,
      action: PayloadAction<{ friend_status: string; user_email: string }>
    ) => {
      console.warn("update status", action.payload);

      const existingMessage = state.messages?.find(
        (msg) => msg.user_email === action.payload.user_email
      );
      if (existingMessage) {
        existingMessage.friend_status = action.payload.friend_status;
        state.messages = [
          existingMessage,
          ...state.messages.filter(
            (msg) => msg.user_email !== action.payload.user_email
          ),
        ];
      }
    },
    // deleteChatListByEmail: (
    //   state,
    //   action: PayloadAction<{ user_email: string }>
    // ) => {
    //   console.warn("delete message by email", action.payload);

    //   state.messages = state.messages.filter(
    //     (msg) => msg.user_email !== action.payload.user_email
    //   );
    // },
    updateChatListDeletedAtByEmail: (
      state,
      action: PayloadAction<{ user_email: string, deletedAt: string | null}>
    ) => {
      console.warn("update status", action.payload);

      const existingMessage = state.messages?.find(
        (msg) => msg.user_email === action.payload.user_email
      );
      if (existingMessage) {
                existingMessage.deletedAt = action.payload.deletedAt;

        state.messages = [
          existingMessage,
          ...state.messages.filter(
            (msg) => msg.user_email !== action.payload.user_email
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
  updateRoomIdByEmail,
  addChatList,
  updateChatListDeletedAtByEmail,
} = chatListSlice.actions;
export default chatListSlice.reducer;

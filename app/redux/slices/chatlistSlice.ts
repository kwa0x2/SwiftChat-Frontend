import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MessageItemModel {
  room_id: string;
  last_message: string;
  updatedAt?: string;
  user_name: string;
  user_photo: string;
  user_email: string;
  friend_status: string;
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
      console.warn("update", action.payload)
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
  },
});

export const {
  setChatList,
  updateLastMessage,
  updateRoomIdByEmail,
  addChatList,
} = chatListSlice.actions;
export default chatListSlice.reducer;

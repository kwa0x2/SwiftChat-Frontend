import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatSliceModel {
  user_email: string;
  user_name: string;
  user_photo: string;
  friend_status: string;
  room_id: string;
  createdAt: string;
  activeStatus?: boolean;
}

interface InitialState {
  value: ChatSliceModel;
}

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    value: {
      user_email: "",
      user_name: "",
      user_photo: "",
      friend_status: "",
      room_id: "",
      createdAt: "",
      activeStatus: false,
    } as ChatSliceModel,
  } as InitialState,
  reducers: {
    setChatData: (state, action: PayloadAction<ChatSliceModel>) => {
      state.value = action.payload;
    },
    updateChatFriendStatusByEmail: (
      state,
      action: PayloadAction<{ friend_status: string; user_email: string }>
    ) => {
      if (state.value.user_email === action.payload.user_email) {
        state.value.friend_status = action.payload.friend_status;
      }
    },
    updateChatUsernameByEmail: (
      state,
      action: PayloadAction<{ user_name: string; user_email: string }>
    ) => {
      if (state.value.user_email === action.payload.user_email) {
        state.value.user_name = action.payload.user_name;
      }
    },
    updateChatUserPhotoByEmail: (
      state,
      action: PayloadAction<{ user_photo: string; user_email: string }>
    ) => {
      if (state.value.user_email === action.payload.user_email) {
        state.value.user_photo = action.payload.user_photo;
      }
    },
    updateChatActiveStatusByEmails: (
      state,
      action: PayloadAction<{ activeEmails: string[] }>
    ) => {
      const activeEmails = action.payload.activeEmails;

      if (!activeEmails.includes(state.value.user_email)) {
        state.value.activeStatus = false;
      } else {
        state.value.activeStatus = true;
      }
    },
  },
});

export const {
  setChatData,
  updateChatFriendStatusByEmail,
  updateChatUsernameByEmail,
  updateChatUserPhotoByEmail,
  updateChatActiveStatusByEmails,
} = chatSlice.actions;

export default chatSlice.reducer;

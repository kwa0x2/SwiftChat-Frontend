import { Message } from "@/models/Message";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MessageItemSliceModel {
  activeComponent?: string;
  other_user_email: string;
  other_user_name: string;
  other_user_photo: string;
  room_id: string;
  friend_status: string;
  messages?: Message[];
  deletedAt?: string | null
}

interface InitialState {
  value: MessageItemSliceModel;
}

export const messageBox = createSlice({
  name: "message-box",
  initialState: {
    value: {
      activeComponent: "friends",
      other_user_email: "",
      other_user_name: "",
      other_user_photo: "",
      friend_status: "",
      room_id: "",
      messages: [],
      deletedAt: "",
    } as MessageItemSliceModel,
  } as InitialState,
  reducers: {
    openChatBox: (state, action: PayloadAction<MessageItemSliceModel>) => {
      state.value = action.payload;
    },
    showProfile: (state) => {
      state.value = {
        ...state.value,
        activeComponent: "profile",
      };
    },
    showFriends: (state) => {
      state.value = {
        ...state.value,
        activeComponent: "friends",
      };
    },
    updateMessageBoxFriendStatusByEmail: (
      state,
      action: PayloadAction<{ friend_status: string; user_email: string }>
    ) => {
      console.warn("update status", action.payload);

      if (state.value.other_user_email === action.payload.user_email) {
        state.value.friend_status = action.payload.friend_status;
      }
    },
    updateMessageBoxDeletedAtByEmail: (
      state,
      action: PayloadAction<{ user_email: string, deletedAt: string | null}>
    ) => {
      if (state.value.other_user_email === action.payload.user_email) {
        state.value.deletedAt = action.payload.deletedAt;
      }
      
    },
    
  },
});

// Action creators are generated for each case reducer function
export const {
  openChatBox,
  showProfile,
  showFriends,
  updateMessageBoxFriendStatusByEmail,
  updateMessageBoxDeletedAtByEmail,
} = messageBox.actions;

export default messageBox.reducer;

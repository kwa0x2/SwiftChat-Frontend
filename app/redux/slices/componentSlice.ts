import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ComponentSliceModel {
  activeComponent: "friends" | "profile" | "chat";
  friendStatus: string;
}

const initialState: ComponentSliceModel = {
  activeComponent: "friends",
  friendStatus: "",
};

const componentSlice = createSlice({
  name: "component",
  initialState,
  reducers: {
    setActiveComponent: (state, action: PayloadAction<ComponentSliceModel['activeComponent']>) => {
      state.activeComponent = action.payload;
    },
    
    setFriendStatus: (state, action: PayloadAction<string>) => {
      state.friendStatus = action.payload;
    },
  },
});

export const {
  setActiveComponent,
  setFriendStatus,
} = componentSlice.actions;

export default componentSlice.reducer;
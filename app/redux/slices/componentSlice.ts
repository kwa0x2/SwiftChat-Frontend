import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ComponentSliceModel {
  activeComponent: "friends" | "profile" | "chat";
}

const initialState: ComponentSliceModel = {
  activeComponent: "friends",
};

const componentSlice = createSlice({
  name: "component",
  initialState,
  reducers: {
    setActiveComponent: (
      state,
      action: PayloadAction<ComponentSliceModel["activeComponent"]>
    ) => {
      state.activeComponent = action.payload;
    },

  },
});

export const { setActiveComponent } = componentSlice.actions;

export default componentSlice.reducer;

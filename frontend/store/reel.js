import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  refreshTogglePlayPause: false,
};

export const reelSlice = createSlice({
  name: "reel",
  initialState,
  reducers: {
    setRefreshTogglePlayPause: (state, action) => {
      state.refreshTogglePlayPause = action.payload;
    },
  },
});

export const { setRefreshTogglePlayPause } = reelSlice.actions;
export default reelSlice.reducer;

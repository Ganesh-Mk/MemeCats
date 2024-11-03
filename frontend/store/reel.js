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
      console.log("In reelReducer: ", state.refreshTogglePlayPause);
    },
  },
});

export const { setRefreshTogglePlayPause } = reelSlice.actions;
export default reelSlice.reducer;

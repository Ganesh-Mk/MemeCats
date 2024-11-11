import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  email: "",
  profileImage: "",
  reels: [],
  refreshUser: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    storeId: (state, action) => {
      state.id = action.payload;
    },
    storeName: (state, action) => {
      state.name = action.payload;
    },
    storeEmail: (state, action) => {
      state.email = action.payload;
    },
    storeProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
    storeReels: (state, action) => {
      state.reels = action.payload;
    },
    storeRefreshUser: (state) => {
      state.refreshReels += 1;
    },
  },
});

export const {
  storeId,
  storeName,
  storeEmail,
  storeProfileImage,
  storeReels,
  storeRefreshUser,
} = userSlice.actions;
export default userSlice.reducer;

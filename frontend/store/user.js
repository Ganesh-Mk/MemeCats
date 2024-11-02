import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  email: "",
  profileImage: "",
  reels: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    storeId: (state, action) => {
      state.id = action.payload;
      console.log("ID: ", state.id);
    },
    storeName: (state, action) => {
      state.name = action.payload;
      console.log("Name: ", state.name);
    },
    storeEmail: (state, action) => {
      state.email = action.payload;
      console.log("Email: ", state.email);
    },
    storeProfileImage: (state, action) => {
      state.profileImage = action.payload;
      console.log("Profile Image: ", state.profileImage);
    },
    storeReels: (state, action) => {
      state.reels = action.payload;
      console.log("Reels: ", state.reels);
    },
  },
});

export const { storeId, storeName, storeEmail, storeProfileImage, storeReels } =
  userSlice.actions;
export default userSlice.reducer;

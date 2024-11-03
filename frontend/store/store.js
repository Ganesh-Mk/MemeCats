import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/user";
import reelReducer from "../store/reel";

const store = configureStore({
  reducer: {
    user: userReducer,
    reel: reelReducer,
  },
});

export default store;

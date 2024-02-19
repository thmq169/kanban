import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";
import boardSlice from "./reducers/boardSlice";
import favoriteSlice from "./reducers/favoriteSlice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    board: boardSlice.reducer,
    favorites: favoriteSlice.reducer,
  },
});

export default store;

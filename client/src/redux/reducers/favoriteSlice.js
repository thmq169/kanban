import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    value: [],
  },
  reducers: {
    setFavoritesList: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default favoriteSlice;

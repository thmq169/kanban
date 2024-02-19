import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "board",
  initialState: {
    value: [],
  },
  reducers: {
    setBoard: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default boardSlice;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  user: SpotifyApi.CurrentUsersProfileResponse | null;
  active_path: null | "search" | "home" | "library";
};

const initialState: InitialState = {
  user: null,
  active_path: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<SpotifyApi.CurrentUsersProfileResponse | null>
    ) {
      state.user = action.payload;
    },

    setActivePath(state, action: PayloadAction<"search" | "home" | "library">) {
      state.active_path = action.payload;
    },
  },
});

export default userSlice.reducer;

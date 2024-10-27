import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  user: SpotifyApi.CurrentUsersProfileResponse | null;
  guest: boolean;
  active_path: null | "search" | "home" | "library";
};

const initialState: InitialState = {
  user: null,
  guest: false,
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

    setGuest(state, action: PayloadAction<boolean>) {
      state.guest = action.payload;
    },

    setActivePath(state, action: PayloadAction<"search" | "home" | "library">) {
      state.active_path = action.payload;
    },
  },
});

export default userSlice.reducer;

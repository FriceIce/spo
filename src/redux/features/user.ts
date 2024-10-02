import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  user: SpotifyApi.CurrentUsersProfileResponse | null;
};

const initialState: InitialState = {
  user: null,
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
  },
});

export default userSlice.reducer;

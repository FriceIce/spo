import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  topArtists: SpotifyApi.ArtistObjectFull[];
};

const initialState: InitialState = {
  topArtists: [],
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setTopArtists: (
      state,
      action: PayloadAction<SpotifyApi.ArtistObjectFull[]>
    ) => {
      state.topArtists = action.payload;
    },
  },
});

export default homeSlice.reducer;

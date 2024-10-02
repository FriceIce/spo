import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Playback = {
  uris: string[];
  offset: number;
  paused: boolean;
  shuffle: boolean;
  repeat: SpotifyApi.PlaybackRepeatState;
  currentPageID: string;
  activeTrack: string | null;
};

const initialState: Playback = {
  uris: [],
  offset: 0, // offset in where to start playback in the list
  paused: true, // whether the player is paused or not
  shuffle: false, // whether the player is in shuffle mode or not
  repeat: "off", // whether the player is in repeat mode or not
  currentPageID: "",
  activeTrack: null,
};

const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {
    setUri: (
      state,
      action: PayloadAction<{ uris: string[]; offset: number }>
    ) => {
      const uris = action.payload.uris;
      const offset = action.payload.offset;

      state.uris = uris;
      state.offset = action.payload.offset;
      state.activeTrack = action.payload.uris[offset];
    },

    setMultipleUris: (
      state,
      action: PayloadAction<{ uris: string[]; pageID: string }>
    ) => {
      state.offset = 0;
      state.uris = action.payload.uris;
      state.currentPageID = action.payload.pageID;
    },

    setActiveTrack: (state, action: PayloadAction<string>) => {
      state.activeTrack = action.payload;
    },

    setIsPaused: (state, action: PayloadAction<boolean>) => {
      state.paused = action.payload;
    },

    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
      console.log(action.payload);
    },

    setRepeat: (
      state,
      action: PayloadAction<SpotifyApi.PlaybackRepeatState>
    ) => {
      const currentState = action.payload;

      if (currentState === "off") state.repeat = "context";

      if (currentState === "context") state.repeat = "track";

      if (currentState === "track") state.repeat = "off";
    },
  },
});

export default playbackSlice.reducer;

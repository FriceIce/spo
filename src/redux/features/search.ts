import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CombinedSpotifySearch, TopResult } from "../../definition";

type InitialState = {
  searchQuery: string;
  searchResults: CombinedSpotifySearch[];
  topResult: TopResult | null;
};

const initialState: InitialState = {
  searchQuery: "",
  searchResults: [],
  topResult: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchResults: (state, action: PayloadAction<CombinedSpotifySearch[]>) => {
      state.searchResults = action.payload;
    },

    topResult: (state, action: PayloadAction<TopResult>) => {
      state.topResult = action.payload;
    },

    specificCategory: (
      state,
      action: PayloadAction<CombinedSpotifySearch[]>
    ) => {
      state.searchResults = [...state.searchResults, ...action.payload];
    },
  },
});

export default searchSlice.reducer;

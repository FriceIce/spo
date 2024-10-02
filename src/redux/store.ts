import { configureStore } from "@reduxjs/toolkit";
import SearchReducer from "./features/search";
import UserReducer from "./features/user";
import PlaybackReducer from "./features/playback";
import HomeReducer from "./features/home";

export const store = configureStore({
  reducer: {
    playback: PlaybackReducer,
    search: SearchReducer,
    user: UserReducer,
    home: HomeReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

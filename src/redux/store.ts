import { configureStore } from "@reduxjs/toolkit";
import localStateReducer from "./slices/localStateSlice";

export const store = configureStore({
	reducer: {
		localState: localStateReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

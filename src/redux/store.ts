import { configureStore } from "@reduxjs/toolkit";
import localStateReducer from "./slices/localStateSlice";
import queryCacheReducer from "./slices/queryCacheSlice";

export const store = configureStore({
	reducer: {
		localState: localStateReducer,
		queryCache: queryCacheReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

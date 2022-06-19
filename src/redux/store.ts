import { configureStore } from "@reduxjs/toolkit";
import friendsSlice from "./slices/friendsSlice";
import localStateReducer from "./slices/localStateSlice";
import queryCacheReducer from "./slices/queryCacheSlice";
import userSlice from "./slices/userSlice";
import usersQuerySlice from "./slices/usersQuerySlice";

export const store = configureStore({
	reducer: {
		localState: localStateReducer,
		queryCache: queryCacheReducer,
		usersQuery: usersQuerySlice,
		user: userSlice,
		friends: friendsSlice,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './slices/chatSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import chatListReducer from './slices/chatListSlice'
import componentReducer from './slices/componentSlice'

export const store = configureStore({
  reducer: {
    chatReducer,
    chatListReducer,
    componentReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
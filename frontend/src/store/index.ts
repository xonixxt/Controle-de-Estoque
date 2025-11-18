import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = { token?: string }

const initialState: AuthState = { token: localStorage.getItem('token') || undefined }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state: AuthState, action: PayloadAction<string>) { state.token = action.payload },
    clearToken(state: AuthState) { delete state.token }
  }
})

export const { setToken, clearToken } = authSlice.actions

const store = configureStore({
  reducer: { auth: authSlice.reducer }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

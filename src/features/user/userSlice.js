import { createSlice } from '@reduxjs/toolkit'
import parseJson from '../../common/helpers/parseJSON';

const initialState = {
  user: parseJson(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  isLoading: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoader(state, action) {
      state.isLoading = true;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.user = JSON.parse(action.payload.user)
      state.token = action.payload.accessToken
      localStorage.setItem('user', action.payload.user)
      localStorage.setItem('token', action.payload.accessToken)
    },
    finishLoader(state, action) {
      state.isLoading = false;
    },
   
    logout(state, action) {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isError = false;
    },
    updateComplexId(state,action) {
      state.user.complexId=action.payload
      state.user.complexId = action.payload
      localStorage.setItem('user', JSON.stringify(state.user))
    }
  }
})

export const { startLoader, loginSuccess, finishLoader, logout, updateComplexId } = userSlice.actions

export default userSlice.reducer
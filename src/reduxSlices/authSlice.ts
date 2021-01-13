import { createSlice } from '@reduxjs/toolkit';

interface State {
  auth: { isLoggedIn: boolean; showModal: boolean };
}

const initialState = {
  isLoggedIn: false,
  showModal: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn(state) {
      state.isLoggedIn = true;
    },
    logout(state, action) {
      const { history } = action.payload;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('expiryDate');
      history.push('/');
    },
    showModal(state) {
      state.showModal = true;
    },
    hideModal(state) {
      state.showModal = false;
    }
  }
});

export const { logIn, logout, showModal, hideModal } = authSlice.actions;

export default authSlice.reducer;

export const selectAuthState = (state: State): boolean => state.auth.isLoggedIn;

export const selectModalState = (state: State): boolean => state.auth.showModal;

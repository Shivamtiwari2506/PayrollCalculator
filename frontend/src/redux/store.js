import { configureStore } from '@reduxjs/toolkit';
import orgReducer from './reducers/orgReducers';
import userReducer from './reducers/userReducers'

export const store = configureStore({
  reducer: {
    orgState: orgReducer,
    userState: userReducer,
  },
});
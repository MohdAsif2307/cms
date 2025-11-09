import { combineReducers } from 'redux';
import authReducer from './authReducer';
import { USER_DATA, USER_TOKEN } from '../action';

// Minimal legacy reducers to expose `userData` and `userToken` at root
const userDataReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DATA:
      return action.payload;
    default:
      return state;
  }
};

const userTokenReducer = (state = '', action) => {
  switch (action.type) {
    case USER_TOKEN:
      return action.payload;
    default:
      return state;
  }
};

export const reducers = combineReducers({
  auth: authReducer,
  userData: userDataReducer,
  userToken: userTokenReducer,
});
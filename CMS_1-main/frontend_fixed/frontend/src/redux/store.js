import { legacy_createStore as createStore } from "redux";
import { reducers } from "./reducers";

// Hydrate initial state from localStorage for faster UI after login/refresh
let preloadedState = {};
try {
  const rawUser = localStorage.getItem('userData');
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  if (rawUser) {
    const parsed = JSON.parse(rawUser);
    preloadedState.auth = {
      user: parsed,
      isAuthenticated: !!token,
      loading: false,
      error: null,
    };
    preloadedState.userData = parsed;
    preloadedState.userToken = token || '';
  }
} catch (e) {
  // ignore parse errors
}

const devtools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const mystore = createStore(reducers, preloadedState, devtools);

export default mystore;

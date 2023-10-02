import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { counterSlice, decrement, increment } from "./services/counterService";
import { apiShell } from "./services/apiService";

const persistedReducer = {
  [counterSlice.name]: counterSlice.reducer,
  [apiShell.reducerPath]: apiShell.reducer,
};

// for adding/removing reducers
export function createReducerManager(initialReducers) {
  // Create an object which maps keys to reducers
  const reducers = { ...initialReducers };
  // Create the initial combinedReducer
  let combinedReducer = combineReducers(reducers);

  // An array which is used to delete state keys when reducers are removed
  let keysToRemove = [];

  const reducerManager = {
    getReducerMap: () => reducers,

    // The root reducer function exposed by this object
    // This will be passed to the store
    reducer: (state, action) => {
      // If any reducers have been removed, clean up their state first
      if (keysToRemove.length > 0) {
        state = { ...state };
        for (let key of keysToRemove) {
          delete state[key];
        }
        keysToRemove = [];
      }

      // Delegate to the combined reducer
      return combinedReducer(state, action);
    },

    // Adds a new reducer with the specified key
    add: (key, reducer) => {
      if (!key || reducers[key]) {
        return;
      }

      // Add the reducer to the reducer mapping
      reducers[key] = reducer;

      // Generate a new combined reducer
      combinedReducer = combineReducers(reducers);
    },

    // Removes a reducer with the specified key
    remove: (k) => {
      const key = k;

      if (!key || !reducers[key]) {
        return;
      }

      // Remove it from the reducer mapping
      delete reducers[key];

      // Add the key to the list of keys to clean up
      keysToRemove.push(key);

      // Generate a new combined reducer
      combinedReducer = combineReducers(reducers);
    },

    enhancer:
      (next) =>
      (...args) => {
        const store = next(...args);
        return {
          ...store,
          reducerManager,
        };
      },
  };
  return reducerManager;
}

export const reducerManager = createReducerManager(persistedReducer);

export const store = configureStore({
  reducer: reducerManager.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([apiShell.middleware]),
});

store.reducerManager = reducerManager;

// adding reducer
// store.reducerManager.add(todoSlice.name, todoSlice.reducer);

export const useStore = () => {
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  return {
    count,
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
  };
};

// ===== External Store ====
export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

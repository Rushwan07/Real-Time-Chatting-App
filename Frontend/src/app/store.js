// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import userReducer from "../features/Auth/userSlice";

// Persist configuration
const persistConfig = {
  key: "user",
  storage,
  whitelist: ["user"], // persist only user slice
};

// Create persisted reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Configure store
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;

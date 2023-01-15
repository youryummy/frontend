import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counter from "./counterSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  counter,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/auth.slice";
import cartReducer from "./slices/cart.slice";
import uiReducer from "./slices/ui.slice";
import { api } from "@/services/api/api";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      ui: uiReducer,

      [api.reducerPath]: api.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),

    devTools: process.env.NODE_ENV !== "production",
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

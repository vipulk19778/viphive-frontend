"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Provider } from "react-redux";

import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setCredentials } from "./slices/auth.slice";
import { setCartItems, type CartItem } from "./slices/cart.slice";
import type { User } from "@/features/auth/types";

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  return (
    <Provider store={store}>
      <SessionManager>{children}</SessionManager>
    </Provider>
  );
}

const SESSION_KEY = "viphive-session";
const CART_KEY = "viphive-cart";

function SessionManager({ children }: StoreProviderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cartItems = useAppSelector((state) => state.cart.items);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const storedSession = window.localStorage.getItem(SESSION_KEY);

    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession) as User;

        if (!parsedSession.token?.trim()) {
          window.localStorage.removeItem(SESSION_KEY);
        } else {
          dispatch(setCredentials(parsedSession));
        }
      } catch {
        window.localStorage.removeItem(SESSION_KEY);
      }
    }

    const storedCart = window.localStorage.getItem(CART_KEY);
    if (storedCart) {
      try {
        dispatch(setCartItems(JSON.parse(storedCart) as CartItem[]));
      } catch {
        window.localStorage.removeItem(CART_KEY);
      }
    }

    const timer = window.setTimeout(() => setHasHydrated(true), 0);

    return () => window.clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (user?.token) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [hasHydrated, user]);

  useEffect(() => {
    if (!hasHydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems, hasHydrated]);

  if (!hasHydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  return <>{children}</>;
}

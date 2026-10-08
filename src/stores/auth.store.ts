import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/auth/types/auth.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  otpEmail: string | null;
  otpPurpose: string | null;
  verifiedOtp: string | null;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setOtpContext: (email: string, purpose: string) => void;
  setVerifiedOtp: (otp: string) => void;
  clearOtpContext: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      otpEmail: null,
      otpPurpose: null,
      verifiedOtp: null,

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),

      setUser: (user) =>
        set({
          user,
        }),

      setOtpContext: (otpEmail, otpPurpose) =>
        set({ otpEmail, otpPurpose, verifiedOtp: null }),

      setVerifiedOtp: (verifiedOtp) => set({ verifiedOtp }),

      clearOtpContext: () =>
        set({ otpEmail: null, otpPurpose: null, verifiedOtp: null }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          otpEmail: null,
          otpPurpose: null,
          verifiedOtp: null,
        }),
    }),
    {
      name: "viphive-auth",
    },
  ),
);

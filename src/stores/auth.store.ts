import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/auth/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  otpEmail: string | null;
  otpPurpose: string | null;
  verifiedOtp: string | null;

  setAuth: (user: User, token: string) => void;
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
      token: null,
      isAuthenticated: false,
      otpEmail: null,
      otpPurpose: null,
      verifiedOtp: null,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

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
          token: null,
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

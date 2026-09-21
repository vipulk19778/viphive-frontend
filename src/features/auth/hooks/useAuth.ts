import { useMutation } from "@tanstack/react-query";

import { login, register, sendOtp, verifyOtp } from "../api/auth.api";

import { useAuthStore } from "@/stores/auth.store";

import type {
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  VerifyOtpRequest,
} from "../types/auth.types";

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  });
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),

    onSuccess: (data) => {
      const token = data.token ?? data.accessToken;

      if (data.user && token) {
        setAuth(data.user, token);
      }
    },
  });
}

export function useVerifyOtp() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => verifyOtp(data),

    onSuccess: (data) => {
      const token = data.token ?? data.accessToken;

      if (data.user && token) {
        setAuth(data.user, token);
      }
    },
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (data: SendOtpRequest) => sendOtp(data),
  });
}

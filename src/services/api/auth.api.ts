import { api } from "./api";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  SendOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/features/auth/types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),

      transformResponse: (response: { data?: User; message?: string }) => ({
        user: response.data,
        message: response.message,
      }),
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),

      transformResponse: (response: { data?: User; message?: string }) => ({
        user: response.data,
        message: response.message,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: { ...body, purpose: "REGISTER" },
      }),

      transformResponse: (response: { data?: User; message?: string }) => ({
        user: response.data,
        message: response.message,
      }),
    }),

    sendOtp: builder.mutation<AuthResponse, SendOtpRequest>({
      query: (body) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: { ...body, purpose: "REGISTER" },
      }),

      transformResponse: (response: {
        data?: { purpose?: string };
        message?: string;
      }) => ({
        message: response.message,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useSendOtpMutation,
} = authApi;

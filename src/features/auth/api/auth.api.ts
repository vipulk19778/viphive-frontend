import { apiClient } from "@/lib/api/client";
import type {
  ApiMessageResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  VerifyOtpRequest,
} from "../types/auth.types";

const AUTH_PATH = "/auth";

export const register = async (
  data: RegisterRequest,
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_PATH}/register`,
    data,
  );

  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    `${AUTH_PATH}/login`,
    data,
  );

  return response.data;
};

export const verifyOtp = async (
  data: VerifyOtpRequest,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    `${AUTH_PATH}/verify-otp`,
    data,
  );

  return response.data;
};

export const sendOtp = async (
  data: SendOtpRequest,
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_PATH}/send-otp`,
    data,
  );

  return response.data;
};

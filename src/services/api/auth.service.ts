import { apiClient } from "@/lib/api/client";
import type {
  ApiMessageResponse,
  AuthApiPayload,
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  SendAuthOtpRequest,
  VerifyOtpRequest,
} from "@/features/auth/types/auth.types";

interface ApiResponse<T> {
  data: T;
}
const AUTH_PATH = "/auth";

export async function register(
  data: RegisterRequest,
): Promise<ApiMessageResponse> {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_PATH}/register`,
    data,
  );
  return response.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthApiPayload>>(
    `${AUTH_PATH}/login`,
    data,
  );
  return normalizeAuthResponse(response.data.data);
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthApiPayload>>(
    `${AUTH_PATH}/verify-otp`,
    data,
  );
  return normalizeAuthResponse(response.data.data);
}

export async function sendOtp(
  data: SendOtpRequest,
): Promise<ApiMessageResponse> {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_PATH}/send-otp`,
    data,
  );
  return response.data;
}

export async function sendAuthOtp(
  data: SendAuthOtpRequest,
): Promise<ApiMessageResponse> {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_PATH}/send-auth-otp`,
    data,
  );
  return response.data;
}

export async function changePassword(
  data: ChangePasswordRequest,
): Promise<ApiMessageResponse> {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_PATH}/change-password`,
    data,
  );
  return response.data;
}

function normalizeAuthResponse(payload: AuthApiPayload): AuthResponse {
  return {
    token: payload.token,
    user: {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      isVerified: payload.verified,
    },
  };
}

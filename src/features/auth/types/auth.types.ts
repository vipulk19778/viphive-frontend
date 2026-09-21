export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose: string;
}

export interface SendOtpRequest {
  email: string;
  purpose: string;
}

export interface SendAuthOtpRequest {
  purpose: string;
}

export interface ChangePasswordRequest {
  otp: string;
  newPassword: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string | number;
  isVerified?: boolean;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  accessToken?: string;
  user?: User;
}

export interface AuthApiPayload {
  _id: string;
  name: string;
  email: string;
  role?: string | number;
  token: string;
  verified?: boolean;
}

export interface ApiMessageResponse {
  message: string;
}

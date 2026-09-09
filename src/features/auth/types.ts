export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface AuthResponse {
  user?: User;
  message?: string;
}

export interface VerifyOtpResponse {
  user?: User;
  message?: string;
}

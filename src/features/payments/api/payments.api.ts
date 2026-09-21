import { apiClient } from "@/lib/api/client";

import type {
  CreatePaymentRequest,
  PaymentOrder,
  VerifyPaymentRequest,
} from "../types/payment.types";

interface ApiResponse<T> {
  data: T;
}

export async function createPayment(payload: CreatePaymentRequest) {
  const response = await apiClient.post<ApiResponse<PaymentOrder>>(
    "/payments/create-payment",
    payload,
  );
  return response.data.data;
}

export async function verifyPayment(payload: VerifyPaymentRequest) {
  const response = await apiClient.post<ApiResponse<{ verified: boolean }>>(
    "/payments/verify-payment",
    payload,
  );
  return response.data.data;
}

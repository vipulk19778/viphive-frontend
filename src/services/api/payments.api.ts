import { api } from "./api";

interface BackendResponse<T> { data: T; }

export interface RazorpayOrder {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
}

interface PaymentInput {
  amount: number;
  orderId: string;
}

interface VerifyPaymentInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<RazorpayOrder, PaymentInput>({
      query: (body) => ({ url: "/payments/create-payment", method: "POST", body }),
      transformResponse: (response: BackendResponse<RazorpayOrder>) => response.data,
    }),
    verifyPayment: builder.mutation<void, VerifyPaymentInput>({
      query: (body) => ({ url: "/payments/verify-payment", method: "POST", body }),
    }),
  }),
});

export const { useCreatePaymentMutation, useVerifyPaymentMutation } = paymentsApi;

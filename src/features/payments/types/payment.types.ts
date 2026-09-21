export interface CreatePaymentRequest {
  amount: number;
  currency?: string;
  orderId: string;
}

export interface PaymentOrder {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

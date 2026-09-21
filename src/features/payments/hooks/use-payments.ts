import { useMutation } from "@tanstack/react-query";

import { createPayment, verifyPayment } from "../api/payments.api";

export function useCreatePayment() {
  return useMutation({ mutationFn: createPayment });
}

export function useVerifyPayment() {
  return useMutation({ mutationFn: verifyPayment });
}

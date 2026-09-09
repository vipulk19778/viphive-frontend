import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { env } from "@/lib/env";

import type { RootState } from "@/store/store";
import { clearCredentials } from "@/store/slices/auth.slice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.user?.token?.trim();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithSessionHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "string" ? args : args.url;
  const isPaymentRequest = requestUrl.startsWith("/payments/");

  if (result.error?.status === 401 && !isPaymentRequest) {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithSessionHandling,

  tagTypes: ["User", "Product", "Order", "Cart"],

  endpoints: () => ({}),
});

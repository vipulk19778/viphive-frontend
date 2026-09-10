export interface BackendFieldError {
  field?: string;
  message?: string;
}

export interface BackendErrorResponse {
  success?: false;
  message?: string;
  errors?: BackendFieldError[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getBackendResponse(error: unknown): BackendErrorResponse | null {
  if (!isRecord(error) || !("data" in error)) return null;

  const data = error.data;
  if (!isRecord(data)) return null;

  return {
    success: data.success === false ? false : undefined,
    message: typeof data.message === "string" ? data.message : undefined,
    errors: Array.isArray(data.errors)
      ? data.errors.filter(isRecord).map((item) => ({
          field: typeof item.field === "string" ? item.field : undefined,
          message: typeof item.message === "string" ? item.message : undefined,
        }))
      : undefined,
  };
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  const backendError = getBackendResponse(error);

  if (backendError?.message) return backendError.message;

  const firstFieldError = backendError?.errors?.find((item) => item.message);
  if (firstFieldError?.message) return firstFieldError.message;

  if (isRecord(error) && error.status === "FETCH_ERROR") {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;

  return fallback;
}

export function getApiFieldErrors(error: unknown) {
  return getBackendResponse(error)?.errors ?? [];
}

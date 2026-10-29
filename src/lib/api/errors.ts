export type ApiErrorKind = "network" | "timeout" | "session" | "http";

export class ApiRequestError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(message: string, kind: ApiErrorKind, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.kind = kind;
    this.status = status;
  }
}

export const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please sign in again.";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (error instanceof ApiRequestError) {
    if (error.kind === "session") return SESSION_EXPIRED_MESSAGE;
    if (error.status === 403) {
      return error.message || "You don't have permission to do that.";
    }
    if (error.status === 404) return error.message || "We couldn't find that.";
    if (error.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }
    if (error.status && error.status >= 500) {
      return "The server ran into a problem. Please try again shortly.";
    }
    return error.message || fallback;
  }

  return error instanceof Error && error.message ? error.message : fallback;
}

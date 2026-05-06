export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

interface ErrorEnvelope {
  success: false;
  error?: string;
}

type Envelope<T> = SuccessEnvelope<T> | ErrorEnvelope;

export function unwrap<T>(envelope: Envelope<T>): T {
  if (!envelope.success) {
    throw new ApiError(
      (envelope as ErrorEnvelope).error ?? "Unknown error",
      0,
      envelope,
    );
  }
  return (envelope as SuccessEnvelope<T>).data;
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

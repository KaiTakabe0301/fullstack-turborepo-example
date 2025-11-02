export type ErrorKind = 'http' | 'network' | 'timeout' | 'parse' | 'unknown';
export class FetchError extends Error {
  code?: string | null;
  correlationId: string;
  details?: unknown;
  kind: ErrorKind;
  method: string;
  status?: number;
  url: string;

  constructor(params: Omit<FetchError, 'toJSON' | 'name'>) {
    super(params.message, { cause: params.cause });
    this.code = params.code;
    this.correlationId = params.correlationId;
    this.details = params.details;
    this.method = params.method;
    this.name = 'FetchError';
    this.kind = params.kind;
    this.status = params.status;
    this.url = params.url;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      kind: this.kind,
      status: this.status,
      code: this.code,
      details: this.details,
      url: this.url,
      method: this.method,
      correlationId: this.correlationId,
      cause: this.cause,
    };
  }
}

export class ParseFetchError extends FetchError {
  constructor(params: Omit<ParseFetchError, 'toJSON' | 'name'>) {
    super({ ...params, kind: 'parse' });
    this.name = 'ParseFetchError';
  }
}

export class TimeoutFetchError extends FetchError {
  constructor(params: Omit<TimeoutFetchError, 'toJSON' | 'name'>) {
    super({ ...params, kind: 'timeout' });
    this.name = 'TimeoutFetchError';
  }
}
export class NetworkFetchError extends FetchError {
  constructor(params: Omit<NetworkFetchError, 'toJSON' | 'name'>) {
    super({ ...params, kind: 'network' });
    this.name = 'NetworkFetchError';
  }
}

export class HTTPFetchError extends FetchError {
  status: number;
  constructor(params: Omit<HTTPFetchError, 'toJSON' | 'name'>) {
    super({ ...params, kind: 'http' });
    this.name = 'HTTPFetchError';
    this.status = params.status;
  }
}

export class UnknownFetchError extends FetchError {
  constructor(params: Omit<UnknownFetchError, 'toJSON' | 'name'>) {
    super({ ...params, kind: 'unknown' });
    this.name = 'UnknownFetchError';
  }
}

export const isAbortError = (error: unknown): boolean => {
  return (
    error instanceof Error &&
    (error.name === 'AbortError' ||
      (error.cause instanceof Error && error.cause.name === 'AbortError'))
  );
};

export const isFetchError = (error: unknown): error is FetchError => {
  return error instanceof FetchError;
};

export const isHttpFetchError = (error: unknown): error is HTTPFetchError => {
  return error instanceof HTTPFetchError;
};

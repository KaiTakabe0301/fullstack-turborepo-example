export interface Logger {
  info: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
  debug: (msg: string, meta?: Record<string, unknown>) => void;
}

export function createLogger(requestId?: string): Logger {
  const baseMetadata = requestId ? { requestId } : {};

  const log = (level: string, msg: string, meta?: Record<string, unknown>) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: msg,
      ...baseMetadata,
      ...meta,
    };

    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(`[${level.toUpperCase()}] ${msg}`, meta ?? '');
    }
  };

  return {
    info: (msg, meta) => log('info', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta),
    debug: (msg, meta) => log('debug', msg, meta),
  };
}

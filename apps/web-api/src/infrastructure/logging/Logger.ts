export interface Logger {
  info: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
  debug: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface LoggerMetadata {
  correlationId?: string;
  ipAddress?: string;
  requestSource?: string;
  context?: string;
}

export function createLogger(metadata?: LoggerMetadata): Logger {
  const baseMetadata = metadata ?? {};

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

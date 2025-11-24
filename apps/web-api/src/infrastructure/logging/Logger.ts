import pino from 'pino';

export interface Logger {
  info: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
  debug: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface LoggerMetadata {
  correlationId?: string;
  ipAddress?: string;
  context?: string;
  userId?: string;
  serviceName?: string;
  serviceVersion?: string;
  environment?: string;
  responseTime?: number;
  memoryUsage?: number;
}

// Get log level from environment or use defaults
const getLogLevel = (): pino.Level => {
  const envLevel = process.env.LOG_LEVEL;
  if (envLevel && ['fatal', 'error', 'warn', 'info', 'debug', 'trace'].includes(envLevel)) {
    return envLevel as pino.Level;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};

// Determine if we should use pretty printing (development only)
const shouldUsePrettyPrint = (): boolean => {
  return process.env.NODE_ENV !== 'production';
};

// Create the base Pino instance with appropriate configuration
const createPinoInstance = () => {
  const level = getLogLevel();

  if (shouldUsePrettyPrint()) {
    return pino({
      level,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
          singleLine: false,
          messageFormat: '{msg}',
        },
      },
    });
  }

  // Production: structured JSON output
  return pino({
    level,
    formatters: {
      level: (label: string) => {
        return { level: label };
      },
    },
  });
};

export function createLogger(metadata?: LoggerMetadata): Logger {
  const baseMetadata = metadata ?? {};
  const pinoInstance = createPinoInstance();

  // Create a child logger with the base metadata
  const childLogger = pinoInstance.child(baseMetadata);

  return {
    info: (msg: string, meta?: Record<string, unknown>) => {
      childLogger.info(meta ?? {}, msg);
    },
    error: (msg: string, meta?: Record<string, unknown>) => {
      childLogger.error(meta ?? {}, msg);
    },
    warn: (msg: string, meta?: Record<string, unknown>) => {
      childLogger.warn(meta ?? {}, msg);
    },
    debug: (msg: string, meta?: Record<string, unknown>) => {
      childLogger.debug(meta ?? {}, msg);
    },
  };
}

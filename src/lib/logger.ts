import 'server-only'
import pino, { type Logger } from 'pino'

const isDev = process.env.NODE_ENV !== 'production'

export const logger: Logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
  base: { service: 'mybooz', env: process.env.NODE_ENV },
  redact: {
    paths: [
      'password',
      'token',
      '*.password',
      '*.token',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    censor: '[redacted]',
  },
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:HH:MM:ss.l', singleLine: false },
        },
      }
    : {}),
})

export function childLogger(bindings: Record<string, unknown>): Logger {
  return logger.child(bindings)
}

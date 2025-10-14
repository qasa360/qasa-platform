import { Logger } from './logger.interface';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

const normalizeLevel = (level: string): LogLevel => {
  if (['debug', 'info', 'warn', 'error'].includes(level)) {
    return level as LogLevel;
  }
  return 'info';
};

export class ConsoleLogger implements Logger {
  private readonly level: LogLevel;

  constructor(level: string) {
    this.level = normalizeLevel(level);
  }

  public debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  public info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  public warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  public error(message: string, metadata?: Record<string, unknown>): void {
    this.log('error', message, metadata);
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.level]) {
      return;
    }

    const payload = metadata ? `${message} | ${JSON.stringify(metadata)}` : message;

    // eslint-disable-next-line no-console
    console[level](payload);
  }
}

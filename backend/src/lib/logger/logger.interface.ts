export interface ILogger {
  error(error: Error, prefixMessage?: string, userId?: string | number): void;
  debug(message: string, userId?: string | number): void;
  info(message: string, userId?: string | number): void;
  warn(message: string, userId?: string | number): void;
}

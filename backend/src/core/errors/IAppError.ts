export interface IAppError {
  name: string;
  message: string;
  httpCode: number;
  logWarning: boolean;
  stack: string;
  userId?: number;

  toJson(): Record<string, unknown>;
}

export const implementsIAppError = (obj: unknown): obj is IAppError => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as IAppError).toJson === "function"
  );
};

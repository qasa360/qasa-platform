export const CORE_TYPES = {
  AppConfig: Symbol.for("AppConfig"),
} as const;

export const LIBS_TYPES = {
  IMetrics: Symbol.for("IMetrics"),
  IDbLogger: Symbol.for("IDbLogger"),
  ILogger: Symbol.for("ILogger"),
  IRequestLogger: Symbol.for("IRequestLogger"),
} as const;

export const INFRASTRUCTURE_TYPES = {
  IPgClient: Symbol.for("IPgClient"),
  IPrismaCustomClient: Symbol.for("IPrismaCustomClient"),
} as const;
